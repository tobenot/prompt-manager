/**
 * Prompt Manager - Sidebar Component
 * 
 * 数据安全声明：本侧边栏组件仅访问和展示存储在本地的分类和标签数据，
 * 不会将任何用户数据上传至服务器，确保用户数据的隐私和安全。
 * 
 * 开源声明：本项目代码基于MIT许可证开源，欢迎贡献和使用。
 * 
 * @license MIT
 * @copyright Copyright (c) 2024
 */

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
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCategoryId,
  selectedTag,
  onCategorySelect,
  onTagSelect,
  onFavoritesSelect,
  onAllPromptsSelect,
  showNewCategoryForm,
  isOpen = true,
  onClose,
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
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };
  
  // 处理标签点击
  const handleTagClick = (tagName: string) => {
    if (tagName) {
      onTagSelect(tagName);
      if (onClose && window.innerWidth < 768) {
        onClose();
      }
    }
  };

  // 处理全部提示词点击
  const handleAllPromptsClick = () => {
    onAllPromptsSelect();
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  // 处理收藏夹点击
  const handleFavoritesClick = () => {
    onFavoritesSelect();
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  // 获取分类图标
  const getCategoryIcon = (iconName: string = 'folder') => {
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
  
  // 侧边栏基本样式
  const sidebarBaseClass = "bg-card border-r border-border/40 shadow-sm backdrop-blur-xs animate-fade-in h-full";
  
  // 移动端侧边栏样式
  const mobileSidebarClass = isOpen 
    ? "fixed inset-0 z-40 w-72 translate-x-0 transition-transform duration-300 ease-in-out" 
    : "fixed inset-0 z-40 w-72 -translate-x-full transition-transform duration-300 ease-in-out";
  
  // 桌面端侧边栏样式
  const desktopSidebarClass = "hidden md:block w-64";
  
  return (
    <>
      {/* 移动端侧边栏背景遮罩 */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30 animate-fade-in backdrop-blur-xs"
          onClick={onClose}
        ></div>
      )}
      
      {/* 移动端侧边栏 */}
      <div className={`${sidebarBaseClass} ${mobileSidebarClass} md:hidden`}>
        <div className="p-5 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold text-foreground px-1">
              {t('app.name')}
            </h2>
            <button 
              className="p-1 rounded-full hover:bg-muted/80 text-foreground/80"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          
          {/* 侧边栏内容 */}
          <div className="mb-6">
            {/* 全部提示词 */}
            <button
              className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 mb-1.5
                ${!selectedCategoryId && !selectedTag 
                  ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                  : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
              onClick={handleAllPromptsClick}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🗂️</span>
                <span className="text-sm">{t('nav.allPrompts')}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{prompts.length}</span>
            </button>
            
            {/* 收藏夹 */}
            <button
              className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 mb-5
                ${selectedTag === 'favorites' 
                  ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                  : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
              onClick={handleFavoritesClick}
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="text-sm">{t('nav.favorites')}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{favoriteCount}</span>
            </button>
          </div>
          
          {/* 分类部分 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('nav.categories')}
              </h3>
              {showNewCategoryForm && (
                <button
                  className="text-xs text-primary hover:text-primary/80 transition-colors p-1 rounded hover:bg-primary/5"
                  onClick={showNewCategoryForm}
                >
                  + {t('actions.new')}
                </button>
              )}
            </div>
            
            {/* 分类列表 */}
            <div className="space-y-1 mb-6 max-h-[30vh] overflow-y-auto pr-1 custom-scrollbar">
              {categories.map((category: PromptCategory) => (
                <button
                  key={category.id}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                    ${selectedCategoryId === category.id 
                      ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                      : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
                  onClick={() => handleCategoryClick(category.id)}
                  style={{
                    borderLeft: selectedCategoryId === category.id ? `3px solid ${category.color}` : '3px solid transparent'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: category.color }}>{getCategoryIcon(category.icon)}</span>
                    <span className="text-sm truncate max-w-[120px]">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-foreground/10">{category.promptCount}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 标签部分 */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {t('nav.tags')}
            </h3>
            
            {/* 标签列表 */}
            <div className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {displayedTags.map((tag: Tag) => (
                <button
                  key={tag.id}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                    ${selectedTag === tag.name 
                      ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                      : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
                  onClick={() => tag.name && handleTagClick(tag.name)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary/70 text-sm">#</span>
                    <span className="text-sm truncate max-w-[130px]">
                      {tag.name}
                    </span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-foreground/10">{tag.promptCount}</span>
                </button>
              ))}
              
              {/* 显示更多标签 */}
              {tags.length > 5 && (
                <button
                  className="text-xs text-primary hover:text-primary/80 transition-colors py-2 px-3 w-full text-left hover:bg-primary/5 rounded mt-2"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? t('actions.showLess') : `${t('actions.showMore')} (${tags.length - 5})`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 桌面端侧边栏 */}
      <div className={`${sidebarBaseClass} ${desktopSidebarClass}`}>
        <div className="p-5 flex flex-col h-full">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-foreground mb-4 px-1">
              {t('app.name')}
            </h2>
          
            {/* 全部提示词 */}
            <button
              className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 mb-1.5
                ${!selectedCategoryId && !selectedTag 
                  ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                  : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
              onClick={onAllPromptsSelect}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🗂️</span>
                <span className="text-sm">{t('nav.allPrompts')}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{prompts.length}</span>
            </button>
            
            {/* 收藏夹 */}
            <button
              className={`flex justify-between items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 mb-5
                ${selectedTag === 'favorites' 
                  ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                  : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
              onClick={onFavoritesSelect}
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">⭐</span>
                <span className="text-sm">{t('nav.favorites')}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/10">{favoriteCount}</span>
            </button>
          </div>
          
          {/* 分类部分 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3 px-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('nav.categories')}
              </h3>
              {showNewCategoryForm && (
                <button
                  className="text-xs text-primary hover:text-primary/80 transition-colors p-1 rounded hover:bg-primary/5"
                  onClick={showNewCategoryForm}
                >
                  + {t('actions.new')}
                </button>
              )}
            </div>
            
            {/* 分类列表 */}
            <div className="space-y-1 mb-6 max-h-[30vh] overflow-y-auto pr-1 custom-scrollbar">
              {categories.map((category: PromptCategory) => (
                <button
                  key={category.id}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                    ${selectedCategoryId === category.id 
                      ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                      : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
                  onClick={() => handleCategoryClick(category.id)}
                  style={{
                    borderLeft: selectedCategoryId === category.id ? `3px solid ${category.color}` : '3px solid transparent'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ color: category.color }}>{getCategoryIcon(category.icon)}</span>
                    <span className="text-sm truncate max-w-[120px]">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-foreground/10">{category.promptCount}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* 标签部分 */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
              {t('nav.tags')}
            </h3>
            
            {/* 标签列表 */}
            <div className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
              {displayedTags.map((tag: Tag) => (
                <button
                  key={tag.id}
                  className={`flex justify-between items-center w-full px-3 py-2 rounded-lg transition-all duration-200
                    ${selectedTag === tag.name 
                      ? 'bg-primary/10 text-primary font-medium shadow-sm' 
                      : 'hover:bg-muted/80 text-foreground/80 hover:text-foreground hover:translate-x-0.5'}`}
                  onClick={() => tag.name && handleTagClick(tag.name)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-primary/70 text-sm">#</span>
                    <span className="text-sm truncate max-w-[130px]">
                      {tag.name}
                    </span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-foreground/10">{tag.promptCount}</span>
                </button>
              ))}
              
              {/* 显示更多标签 */}
              {tags.length > 5 && (
                <button
                  className="text-xs text-primary hover:text-primary/80 transition-colors py-2 px-3 w-full text-left hover:bg-primary/5 rounded mt-2"
                  onClick={() => setShowAllTags(!showAllTags)}
                >
                  {showAllTags ? t('actions.showLess') : `${t('actions.showMore')} (${tags.length - 5})`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 