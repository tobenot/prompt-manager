import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt, I18nText, PromptCategory } from '../../types';
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
  const { t, i18n } = useTranslation('common');
  const { addPrompt, updatePrompt, categories } = usePromptStore();
  const isEditing = !!prompt;
  
  // 表单状态
  const [title, setTitle] = useState<I18nText>(prompt?.title || { en: '', zh: '' });
  const [content, setContent] = useState<I18nText>(prompt?.content || { en: '', zh: '' });
  const [description, setDescription] = useState<I18nText>(prompt?.description || { en: '', zh: '' });
  const [categoryId, setCategoryId] = useState<string>(prompt?.categoryId || (categories[0]?.id || ''));
  const [tags, setTags] = useState<string[]>(prompt?.tags || []);
  const [tagInput, setTagInput] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState<boolean>(prompt?.isFavorite || false);
  
  // 错误状态
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
    categoryId?: string;
  }>({});
  
  // 当前语言
  const currentLang = i18n.language as 'en' | 'zh';
  
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
    if (!title[currentLang]?.trim()) {
      newErrors.title = t('validation.titleRequired');
    }
    
    // 验证内容
    if (!content[currentLang]?.trim()) {
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
  
  // 更新单个语言的文本
  const updateI18nText = (
    setter: React.Dispatch<React.SetStateAction<I18nText>>,
    lang: 'en' | 'zh',
    value: string
  ) => {
    setter(prev => ({
      ...prev,
      [lang]: value,
    }));
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('prompt.title')} *
        </label>
        <div className="space-y-2">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs mr-2">🇺🇸</span>
              <span className="text-xs text-muted-foreground">English</span>
            </div>
            <input
              type="text"
              className={`input w-full ${errors.title && currentLang === 'en' ? 'border-red-500' : ''}`}
              value={title.en}
              onChange={(e) => updateI18nText(setTitle, 'en', e.target.value)}
              placeholder={t('prompt.titlePlaceholder')}
            />
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs mr-2">🇨🇳</span>
              <span className="text-xs text-muted-foreground">中文</span>
            </div>
            <input
              type="text"
              className={`input w-full ${errors.title && currentLang === 'zh' ? 'border-red-500' : ''}`}
              value={title.zh}
              onChange={(e) => updateI18nText(setTitle, 'zh', e.target.value)}
              placeholder={t('prompt.titlePlaceholder')}
            />
          </div>
          
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>
      </div>
      
      {/* 内容 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('prompt.content')} *
        </label>
        <div className="space-y-2">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs mr-2">🇺🇸</span>
              <span className="text-xs text-muted-foreground">English</span>
            </div>
            <textarea
              className={`input w-full min-h-[200px] font-mono ${errors.content && currentLang === 'en' ? 'border-red-500' : ''}`}
              value={content.en}
              onChange={(e) => updateI18nText(setContent, 'en', e.target.value)}
              placeholder={t('prompt.contentPlaceholder')}
            />
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs mr-2">🇨🇳</span>
              <span className="text-xs text-muted-foreground">中文</span>
            </div>
            <textarea
              className={`input w-full min-h-[200px] font-mono ${errors.content && currentLang === 'zh' ? 'border-red-500' : ''}`}
              value={content.zh}
              onChange={(e) => updateI18nText(setContent, 'zh', e.target.value)}
              placeholder={t('prompt.contentPlaceholder')}
            />
          </div>
          
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
        </div>
      </div>
      
      {/* 描述 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('prompt.description')}
        </label>
        <div className="space-y-2">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs mr-2">🇺🇸</span>
              <span className="text-xs text-muted-foreground">English</span>
            </div>
            <textarea
              className="input w-full"
              value={description.en}
              onChange={(e) => updateI18nText(setDescription, 'en', e.target.value)}
              placeholder={t('prompt.descriptionPlaceholder')}
              rows={2}
            />
          </div>
          
          <div>
            <div className="flex items-center mb-1">
              <span className="text-xs mr-2">🇨🇳</span>
              <span className="text-xs text-muted-foreground">中文</span>
            </div>
            <textarea
              className="input w-full"
              value={description.zh}
              onChange={(e) => updateI18nText(setDescription, 'zh', e.target.value)}
              placeholder={t('prompt.descriptionPlaceholder')}
              rows={2}
            />
          </div>
        </div>
      </div>
      
      {/* 分类 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('prompt.category')} *
        </label>
        <select
          className={`input w-full ${errors.categoryId ? 'border-red-500' : ''}`}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">{t('prompt.selectCategory')}</option>
          {categories.map((category: PromptCategory) => (
            <option key={category.id} value={category.id}>
              {category.name[currentLang] || category.name.en || category.name.zh}
            </option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
      </div>
      
      {/* 标签 */}
      <div>
        <label className="block text-sm font-medium mb-1">
          {t('prompt.tags')}
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <div 
              key={tag} 
              className="badge bg-muted flex items-center gap-1 text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => handleRemoveTag(tag)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="input w-full"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={t('prompt.tagPlaceholder')}
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleAddTag}
            disabled={!tagInput.trim()}
          >
            {t('actions.add')}
          </button>
        </div>
      </div>
      
      {/* 收藏 */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isFavorite"
          checked={isFavorite}
          onChange={(e) => setIsFavorite(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isFavorite" className="text-sm">
          {t('prompt.markAsFavorite')}
        </label>
      </div>
      
      {/* 按钮 */}
      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
        >
          {t('actions.cancel')}
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          {isEditing ? t('actions.update') : t('actions.create')}
        </button>
      </div>
    </form>
  );
};

export default PromptForm; 