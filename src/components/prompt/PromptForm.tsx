/**
 * Prompt Manager - Prompt Form Component
 * 
 * 数据安全声明：本组件处理的所有数据均保存在本地IndexedDB中，
 * 不会上传到任何服务器，确保用户提示词数据的隐私和安全。
 * 
 * 开源声明：本项目代码基于MIT许可证开源，欢迎贡献和使用。
 * 
 * @license MIT
 * @copyright Copyright (c) 2024
 */

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt, PromptCategory } from '../../types';
import { usePromptStore } from '../../store';

interface PromptFormProps {
  prompt?: Prompt;
  onSubmit?: (promptId: string) => void;
  onCancel?: () => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation('common');
  const { addPrompt, updatePrompt, categories, addCategory } = usePromptStore();
  const isEditing = !!prompt;
  
  // 表单状态
  const [title, setTitle] = useState<string>(prompt?.title || '');
  const [content, setContent] = useState<string>(prompt?.content || '');
  const [description, setDescription] = useState<string>(prompt?.description || '');
  const [categoryId, setCategoryId] = useState<string>(prompt?.categoryId || (categories[0]?.id || ''));
  const [tags, setTags] = useState<string[]>(prompt?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(prompt?.isFavorite || false);
  
  // 新分类模态框状态
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDesc, setNewCategoryDesc] = useState<string>('');
  const [newCategoryColor, setNewCategoryColor] = useState<string>('#3498db');
  const [newCategoryIcon, setNewCategoryIcon] = useState<string>('folder');
  const [categoryFormError, setCategoryFormError] = useState<string>('');
  
  // 错误状态
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    categoryId?: string;
  }>({});
  
  // 如果分类为空，使用第一个分类
  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);
  
  // 验证表单
  const validateForm = () => {
    const newErrors: {
      title?: string;
      content?: string;
      categoryId?: string;
    } = {};
    
    // 验证标题
    if (!title?.trim()) {
      newErrors.title = t('validation.titleRequired');
    }
    
    // 验证内容
    if (!content?.trim()) {
      newErrors.content = t('validation.contentRequired');
    }
    
    // 验证分类
    if (!categoryId) {
      newErrors.categoryId = t('validation.categoryRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 处理提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      let promptId: string | null;
      
      if (isEditing && prompt) {
        // 更新提示词
        await updatePrompt(prompt.id, {
          title,
          content,
          description,
          categoryId,
          tags,
          isFavorite,
        });
        promptId = prompt.id;
      } else {
        // 添加新提示词
        promptId = await addPrompt({
          title,
          content,
          description,
          categoryId,
          tags,
          isFavorite,
          isPinned: false,
          variables: [],
        });
      }
      
      if (promptId && onSubmit) {
        onSubmit(promptId);
      }
    } catch (error) {
      console.error('保存提示词失败:', error);
      alert(t('message.saveFailed'));
    }
  };
  
  // 处理标签添加
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  // 处理按键事件 (Enter 添加标签)
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // 处理标签删除
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // 打开新分类模态框
  const openCategoryModal = () => {
    setShowCategoryModal(true);
    setNewCategoryName('');
    setNewCategoryDesc('');
    setNewCategoryColor('#3498db');
    setNewCategoryIcon('folder');
    setCategoryFormError('');
  };
  
  // 关闭新分类模态框
  const closeCategoryModal = () => {
    setShowCategoryModal(false);
  };
  
  // 验证分类表单
  const validateCategoryForm = () => {
    if (!newCategoryName.trim()) {
      setCategoryFormError(t('validation.categoryNameRequired'));
      return false;
    }
    
    // 检查分类名是否已存在
    const categoryExists = categories.some(
      category => category.name.toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    
    if (categoryExists) {
      setCategoryFormError(t('validation.categoryNameExists'));
      return false;
    }
    
    return true;
  };
  
  // 处理添加新分类
  const handleAddCategory = async () => {
    if (!validateCategoryForm()) {
      return;
    }
    
    try {
      const newCategoryId = await addCategory({
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
        color: newCategoryColor,
        icon: newCategoryIcon,
      });
      
      if (newCategoryId) {
        // 设置当前选中的分类为新创建的分类
        setCategoryId(newCategoryId);
        closeCategoryModal();
      }
    } catch (error) {
      console.error('添加分类失败:', error);
      setCategoryFormError(t('message.addCategoryFailed'));
    }
  };
  
  // 获取分类图标
  const getCategoryIcon = (iconName: string) => {
    switch(iconName) {
      case 'folder': return '📁';
      case 'document': return '📄';
      case 'code': return '💻';
      case 'star': return '⭐';
      case 'light': return '💡';
      case 'message': return '💬';
      case 'robot': return '🤖';
      default: return '📁';
    }
  };
  
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
        {/* 标题 */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {t('prompt.title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`input w-full ${errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('prompt.titlePlaceholder')}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
        </div>
        
        {/* 内容 */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {t('prompt.content')} <span className="text-red-500">*</span>
          </label>
          <textarea
            className={`input w-full min-h-[150px] sm:min-h-[200px] font-mono text-xs sm:text-sm ${errors.content ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('prompt.contentPlaceholder')}
          />
          {errors.content && <p className="text-red-500 text-xs mt-1.5">{errors.content}</p>}
        </div>
        
        {/* 描述 */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {t('prompt.description')}
          </label>
          <textarea
            className="input w-full text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('prompt.descriptionPlaceholder')}
            rows={3}
          />
        </div>
        
        {/* 分类 */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {t('prompt.category')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 w-full">
              <select
                className={`input w-full pl-10 appearance-none ${errors.categoryId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">{t('prompt.selectCategory')}</option>
                {categories.map((category: PromptCategory) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                {categoryId && (
                  <span style={{ color: categories.find(c => c.id === categoryId)?.color || '#3498db' }}>
                    {getCategoryIcon(categories.find(c => c.id === categoryId)?.icon || 'folder')}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={openCategoryModal}
              title={t('category.addNew')}
            >
              +
            </button>
          </div>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1.5">{errors.categoryId}</p>}
        </div>
        
        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            {t('prompt.tags')}
          </label>
          <div className="flex flex-wrap gap-2 mb-2 min-h-[28px]">
            {tags.map(tag => (
              <div 
                key={tag} 
                className="tag flex items-center gap-1 text-sm bg-primary/10 text-primary"
              >
                <span className="opacity-70 text-xs">#</span>
                <span>{tag}</span>
                <button
                  type="button"
                  className="ml-1 text-primary/70 hover:text-primary transition-colors"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 w-full">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                #
              </div>
              <input
                type="text"
                className="input w-full pl-7"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={t('prompt.tagPlaceholder')}
              />
            </div>
            <button
              type="button"
              className="btn btn-outline whitespace-nowrap"
              onClick={handleAddTag}
              disabled={!tagInput.trim()}
            >
              {t('actions.add')}
            </button>
          </div>
        </div>
        
        {/* 收藏 */}
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="isFavorite"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer 
                          peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
                          peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium">
              {t('prompt.markAsFavorite')}
            </span>
          </label>
        </div>
        
        {/* 按钮 */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
          <button
            type="button"
            className="btn btn-ghost w-full sm:w-auto mt-2 sm:mt-0"
            onClick={onCancel}
          >
            {t('actions.cancel')}
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
          >
            {isEditing ? t('actions.update') : t('actions.create')}
          </button>
        </div>
      </form>
      
      {/* 新分类模态框 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-xs animate-fade-in p-4">
          <div className="bg-card p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-md border border-border/60 animate-scale-in">
            <h3 className="text-lg font-medium mb-4">{t('category.createNew')}</h3>
            
            {categoryFormError && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">
                {categoryFormError}
              </div>
            )}
            
            <div className="space-y-4">
              {/* 分类名称 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('category.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder={t('category.namePlaceholder')}
                />
              </div>
              
              {/* 分类描述 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('category.description')}
                </label>
                <textarea
                  className="input w-full"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder={t('category.descriptionPlaceholder')}
                  rows={2}
                />
              </div>
              
              {/* 分类颜色 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('category.color')}
                </label>
                <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                  <input
                    type="color"
                    className="h-10 w-12 border border-border rounded cursor-pointer"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input flex-1"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>
              
              {/* 分类图标 */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  {t('category.icon')}
                </label>
                <div className="relative">
                  <select
                    className="input w-full pl-10 appearance-none"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                  >
                    <option value="folder">📁 {t('icons.folder')}</option>
                    <option value="document">📄 {t('icons.document')}</option>
                    <option value="code">💻 {t('icons.code')}</option>
                    <option value="star">⭐ {t('icons.star')}</option>
                    <option value="light">💡 {t('icons.light')}</option>
                    <option value="message">💬 {t('icons.message')}</option>
                    <option value="robot">🤖 {t('icons.robot')}</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {getCategoryIcon(newCategoryIcon)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 mt-6">
              <button
                type="button"
                className="btn btn-ghost w-full sm:w-auto mt-2 sm:mt-0"
                onClick={closeCategoryModal}
              >
                {t('actions.cancel')}
              </button>
              <button
                type="button"
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleAddCategory}
              >
                {t('actions.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptForm; 