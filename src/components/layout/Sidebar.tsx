import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePromptStore } from '../../store';
import { PromptCategory, Tag } from '../../types';

interface SidebarProps {
  selectedCategoryId?: string;
  selectedTag?: string;
  onCategorySelect: (categoryId: string) => void;
  onTagSelect: (tag: string) => void;
  onFavoritesSelect: () => void;
  onAllPromptsSelect: () => void;
  showNewCategoryForm?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategoryId,
  selectedTag,
  onCategorySelect,
  onTagSelect,
  onFavoritesSelect,
  onAllPromptsSelect,
  showNewCategoryForm,
}) => {
  const { t } = useTranslation('common');
  const { prompts, categories, tags } = usePromptStore();
  const [showAllTags, setShowAllTags] = useState(false);
  
  // 计算收藏数量
  const favoriteCount = prompts.filter(p => p.isFavorite).length;
  
  // 显示的标签列表 (最多显示5个或全部)
  const displayedTags = showAllTags ? tags : tags.slice(0, 5);
  
  // 处理分类点击
  const handleCategoryClick = (categoryId: string) => {
    onCategorySelect(categoryId);
  };
  
  // 处理标签点击
  const handleTagClick = (tag: string) => {
    onTagSelect(tag);
  };
  
  return (
    <div className="w-64 border-r border-border h-full bg-card">
      <div className="p-4">
        {/* 全部提示词 */}
        <button
          className={`flex justify-between items-center w-full px-3 py-2 rounded-md transition-colors mb-1
            ${!selectedCategoryId && !selectedTag ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          onClick={onAllPromptsSelect}
        >
          <span className="text-sm font-medium">{t('nav.allPrompts')}</span>
          <span className="text-xs text-muted-foreground">{prompts.length}</span>
        </button>
        
        {/* 收藏夹 */}
        <button
          className={`flex justify-between items-center w-full px-3 py-2 rounded-md transition-colors mb-3
            ${selectedTag === 'favorites' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          onClick={onFavoritesSelect}
        >
          <div className="flex items-center">
            <span className="mr-2">★</span>
            <span className="text-sm font-medium">{t('nav.favorites')}</span>
          </div>
          <span className="text-xs text-muted-foreground">{favoriteCount}</span>
        </button>
        
        {/* 分类标题 */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {t('nav.categories')}
          </h3>
          {showNewCategoryForm && (
            <button
              className="text-xs text-primary hover:text-primary/80 transition-colors"
              onClick={showNewCategoryForm}
            >
              + {t('actions.new')}
            </button>
          )}
        </div>
        
        {/* 分类列表 */}
        <div className="space-y-1 mb-6">
          {categories.map((category: PromptCategory) => (
            <button
              key={category.id}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-md transition-colors
                ${selectedCategoryId === category.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <span className="text-sm">
                {category.name}
              </span>
              <span className="text-xs text-muted-foreground">{category.promptCount}</span>
            </button>
          ))}
        </div>
        
        {/* 标签标题 */}
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {t('nav.tags')}
        </h3>
        
        {/* 标签列表 */}
        <div className="space-y-1">
          {displayedTags.map((tag: Tag) => (
            <button
              key={tag.id}
              className={`flex justify-between items-center w-full px-3 py-2 rounded-md transition-colors
                ${selectedTag === tag.name ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
              onClick={() => handleTagClick(tag.name)}
            >
              <span className="text-sm">
                {tag.name}
              </span>
              <span className="text-xs text-muted-foreground">{tag.promptCount}</span>
            </button>
          ))}
          
          {/* 显示更多标签 */}
          {tags.length > 5 && (
            <button
              className="text-xs text-primary hover:text-primary/80 transition-colors px-3 py-2"
              onClick={() => setShowAllTags(!showAllTags)}
            >
              {showAllTags ? t('actions.showLess') : t('actions.showMore')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 