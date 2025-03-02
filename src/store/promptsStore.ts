/**
 * Prompt Manager - Prompt Store
 * 
 * 数据安全声明：本存储模块使用IndexedDB将所有数据保存在用户本地浏览器中，
 * 不会将任何用户数据上传至任何服务器，确保用户数据的隐私和安全。
 * 
 * 开源声明：本项目代码基于MIT许可证开源，欢迎贡献和使用。
 * 
 * @license MIT
 * @copyright Copyright (c) 2024
 */

import { create } from 'zustand';
import { Prompt, PromptState, PromptCategory, Tag } from '../types';
import db from '../utils/indexedDB';
import { generateId, getCurrentTime } from '../utils/helpers';

// 提示词状态存储
const usePromptStore = create<PromptState>((set, get) => ({
  // 状态
  prompts: [],
  categories: [],
  tags: [],
  
  // 初始化数据
  initialize: async () => {
    try {
      // 从IndexedDB加载提示词数据
      const prompts = await db.prompts.getAll();
      const categories = await db.categories.getAll();
      const tags = await db.tags.getAll();
      
      set({ prompts, categories, tags });
      
      // 如果没有分类，添加默认分类
      if (categories.length === 0) {
        const defaultCategory = {
          id: generateId(),
          name: '通用',
          description: '提示词的默认分类',
          color: '#3498db',
          icon: 'folder',
          promptCount: 0,
          createdAt: getCurrentTime(),
          updatedAt: getCurrentTime(),
        };
        
        await db.categories.add(defaultCategory);
        set(state => ({ categories: [...state.categories, defaultCategory] }));
      }
    } catch (error) {
      console.error('初始化提示词数据失败:', error);
    }
  },
  
  // 添加提示词
  addPrompt: async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const now = getCurrentTime();
      const newPrompt: Prompt = {
        ...prompt,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      };
      
      // 保存到数据库
      await db.prompts.add(newPrompt);
      
      // 更新状态
      set(state => ({
        prompts: [...state.prompts, newPrompt],
      }));
      
      // 更新分类数量
      get().updateCategoryPromptCount(newPrompt.categoryId);
      
      // 更新标签数量
      if (newPrompt.tags && newPrompt.tags.length > 0) {
        get().updateTagsPromptCount(newPrompt.tags);
      }
      
      return newPrompt.id;
    } catch (error) {
      console.error('添加提示词失败:', error);
      return null;
    }
  },
  
  // 更新提示词
  updatePrompt: async (id: string, updates: Partial<Prompt>) => {
    try {
      const currentPrompt = get().prompts.find(p => p.id === id);
      if (!currentPrompt) return false;
      
      // 获取旧分类和标签，用于更新数量
      const oldCategoryId = currentPrompt.categoryId;
      const oldTags = [...currentPrompt.tags];
      
      const updatedPrompt: Prompt = {
        ...currentPrompt,
        ...updates,
        updatedAt: getCurrentTime(),
      };
      
      // 保存到数据库
      await db.prompts.update(updatedPrompt);
      
      // 更新状态
      set(state => ({
        prompts: state.prompts.map(p => (p.id === id ? updatedPrompt : p)),
      }));
      
      // 如果分类变更，更新分类数量
      if (updates.categoryId && updates.categoryId !== oldCategoryId) {
        get().updateCategoryPromptCount(oldCategoryId);
        get().updateCategoryPromptCount(updates.categoryId);
      }
      
      // 如果标签变更，更新标签数量
      if (updates.tags) {
        // 识别移除的标签
        const removedTags = oldTags.filter(tag => !updates.tags?.includes(tag));
        // 识别新增的标签
        const addedTags = updates.tags.filter(tag => !oldTags.includes(tag));
        
        // 更新数量
        if (removedTags.length > 0) get().updateTagsPromptCount(removedTags);
        if (addedTags.length > 0) get().updateTagsPromptCount(addedTags);
      }
      
      return true;
    } catch (error) {
      console.error('更新提示词失败:', error);
      return false;
    }
  },
  
  // 删除提示词
  deletePrompt: async (id: string) => {
    try {
      const promptToDelete = get().prompts.find(p => p.id === id);
      if (!promptToDelete) return false;
      
      // 从数据库删除
      await db.prompts.delete(id);
      
      // 更新状态
      set(state => ({
        prompts: state.prompts.filter(p => p.id !== id),
      }));
      
      // 更新分类数量
      get().updateCategoryPromptCount(promptToDelete.categoryId);
      
      // 更新标签数量
      if (promptToDelete.tags && promptToDelete.tags.length > 0) {
        get().updateTagsPromptCount(promptToDelete.tags);
      }
      
      return true;
    } catch (error) {
      console.error('删除提示词失败:', error);
      return false;
    }
  },
  
  // 增加使用次数
  incrementUsage: async (id: string) => {
    try {
      const currentPrompt = get().prompts.find(p => p.id === id);
      if (!currentPrompt) return false;
      
      const updatedPrompt: Prompt = {
        ...currentPrompt,
        usageCount: currentPrompt.usageCount + 1,
        updatedAt: getCurrentTime(),
      };
      
      // 保存到数据库
      await db.prompts.update(updatedPrompt);
      
      // 更新状态
      set(state => ({
        prompts: state.prompts.map(p => (p.id === id ? updatedPrompt : p)),
      }));
      
      return true;
    } catch (error) {
      console.error('增加使用次数失败:', error);
      return false;
    }
  },
  
  // 切换收藏状态
  toggleFavorite: async (id: string) => {
    try {
      const currentPrompt = get().prompts.find(p => p.id === id);
      if (!currentPrompt) return false;
      
      const updatedPrompt: Prompt = {
        ...currentPrompt,
        isFavorite: !currentPrompt.isFavorite,
        updatedAt: getCurrentTime(),
      };
      
      // 保存到数据库
      await db.prompts.update(updatedPrompt);
      
      // 更新状态
      set(state => ({
        prompts: state.prompts.map(p => (p.id === id ? updatedPrompt : p)),
      }));
      
      return true;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      return false;
    }
  },
  
  // 切换置顶状态
  togglePin: async (id: string) => {
    try {
      const currentPrompt = get().prompts.find(p => p.id === id);
      if (!currentPrompt) return false;
      
      const updatedPrompt: Prompt = {
        ...currentPrompt,
        isPinned: !currentPrompt.isPinned,
        updatedAt: getCurrentTime(),
      };
      
      // 保存到数据库
      await db.prompts.update(updatedPrompt);
      
      // 更新状态
      set(state => ({
        prompts: state.prompts.map(p => (p.id === id ? updatedPrompt : p)),
      }));
      
      return true;
    } catch (error) {
      console.error('切换置顶状态失败:', error);
      return false;
    }
  },
  
  // 添加分类
  addCategory: async (category: Omit<PromptCategory, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>) => {
    try {
      const now = getCurrentTime();
      const newCategory = {
        ...category,
        id: generateId(),
        promptCount: 0,
        createdAt: now,
        updatedAt: now,
      };
      
      // 保存到数据库
      await db.categories.add(newCategory);
      
      // 更新状态
      set(state => ({
        categories: [...state.categories, newCategory],
      }));
      
      return newCategory.id;
    } catch (error) {
      console.error('添加分类失败:', error);
      return null;
    }
  },
  
  // 更新分类
  updateCategory: async (id: string, updates: Partial<PromptCategory>) => {
    try {
      const currentCategory = get().categories.find(c => c.id === id);
      if (!currentCategory) return false;
      
      const updatedCategory = {
        ...currentCategory,
        ...updates,
        updatedAt: getCurrentTime(),
      };
      
      // 保存到数据库
      await db.categories.update(updatedCategory);
      
      // 更新状态
      set(state => ({
        categories: state.categories.map(c => (c.id === id ? updatedCategory : c)),
      }));
      
      return true;
    } catch (error) {
      console.error('更新分类失败:', error);
      return false;
    }
  },
  
  // 删除分类
  deleteCategory: async (id: string) => {
    try {
      // 检查是否有提示词使用此分类
      const promptsWithCategory = get().prompts.filter(p => p.categoryId === id);
      
      // 找到默认分类
      const defaultCategory = get().categories.find(c => 
        c.name === '通用'
      );
      
      // 如果没有默认分类，则创建一个
      let defaultCategoryId = defaultCategory?.id;
      if (!defaultCategoryId) {
        const result = await get().addCategory({
          name: '通用',
          description: '提示词的默认分类',
          color: '#3498db',
          icon: 'folder',
        });
        
        if (result) {
          defaultCategoryId = result;
        } else {
          throw new Error('无法创建默认分类');
        }
      }
      
      // 将使用此分类的提示词移至默认分类
      await Promise.all(
        promptsWithCategory.map(prompt => 
          get().updatePrompt(prompt.id, { categoryId: defaultCategoryId })
        )
      );
      
      // 从数据库删除分类
      await db.categories.delete(id);
      
      // 更新状态
      set(state => ({
        categories: state.categories.filter(c => c.id !== id),
      }));
      
      return true;
    } catch (error) {
      console.error('删除分类失败:', error);
      return false;
    }
  },
  
  // 更新分类的提示词数量
  updateCategoryPromptCount: async (categoryId: string) => {
    try {
      // 计算该分类下的提示词数量
      const promptsInCategory = get().prompts.filter(p => p.categoryId === categoryId);
      const count = promptsInCategory.length;
      
      // 获取当前分类
      const category = get().categories.find(c => c.id === categoryId);
      if (!category) return false;
      
      // 更新分类
      const updatedCategory = {
        ...category,
        promptCount: count,
        updatedAt: getCurrentTime(),
      };
      
      // 保存到数据库
      await db.categories.update(updatedCategory);
      
      // 更新状态
      set(state => ({
        categories: state.categories.map(c => (c.id === categoryId ? updatedCategory : c)),
      }));
      
      return true;
    } catch (error) {
      console.error('更新分类提示词数量失败:', error);
      return false;
    }
  },
  
  // 更新标签组的提示词数量
  updateTagsPromptCount: async (tagNames: string[]) => {
    try {
      // 对每个标签更新数量
      await Promise.all(
        tagNames.map(async (tagName) => {
          // 计算使用此标签的提示词数量
          const promptsWithTag = get().prompts.filter(p => p.tags.includes(tagName));
          const count = promptsWithTag.length;
          
          // 查找现有标签
          let tag = get().tags.find(t => t.name === tagName);
          
          // 如果标签不存在且有提示词使用它，则创建新标签
          if (!tag && count > 0) {
            const now = getCurrentTime();
            tag = {
              id: generateId(),
              name: tagName,
              promptCount: count,
              createdAt: now,
              updatedAt: now,
            };
            
            // 保存到数据库
            await db.tags.add(tag);
            
            // 更新状态
            set(state => ({
              tags: [...state.tags, tag!],
            }));
          } 
          // 如果标签存在，更新数量
          else if (tag) {
            // 如果数量变为0且不是系统标签，则删除标签
            if (count === 0) {
              await db.tags.delete(tag.id);
              
              // 更新状态
              set(state => ({
                tags: state.tags.filter(t => t.id !== tag!.id),
              }));
            } else {
              // 更新标签数量
              const updatedTag = {
                ...tag,
                promptCount: count,
                updatedAt: getCurrentTime(),
              };
              
              // 保存到数据库
              await db.tags.update(updatedTag);
              
              // 更新状态
              set(state => ({
                tags: state.tags.map(t => (t.id === tag!.id ? updatedTag : t)),
              }));
            }
          }
        })
      );
      
      return true;
    } catch (error) {
      console.error('更新标签提示词数量失败:', error);
      return false;
    }
  },
}));

export default usePromptStore; 