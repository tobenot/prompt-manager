import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePromptStore } from '../../store';
import { Prompt } from '../../types';
import { searchFilter } from '../../utils/helpers';
import PromptCard from './PromptCard';

interface PromptListProps {
  categoryId?: string;
  tag?: string;
  searchTerm?: string;
  showFavoritesOnly?: boolean;
  onPromptClick?: (prompt: Prompt) => void;
}

const PromptList: React.FC<PromptListProps> = ({
  categoryId,
  tag,
  searchTerm = '',
  showFavoritesOnly = false,
  onPromptClick,
}) => {
  const { t } = useTranslation('common');
  const { prompts } = usePromptStore();
  
  // 过滤提示词
  const filteredPrompts = useMemo(() => {
    // 初始列表
    let filtered = [...prompts];
    
    // 按分类过滤
    if (categoryId) {
      filtered = filtered.filter(prompt => prompt.categoryId === categoryId);
    }
    
    // 按标签过滤
    if (tag) {
      filtered = filtered.filter(prompt => prompt.tags.includes(tag));
    }
    
    // 只显示收藏
    if (showFavoritesOnly) {
      filtered = filtered.filter(prompt => prompt.isFavorite);
    }
    
    // 搜索过滤
    if (searchTerm) {
      filtered = searchFilter(filtered, searchTerm, ['title', 'content', 'description', 'tags']);
    }
    
    // 排序: 先置顶，再按更新时间排序
    return filtered.sort((a, b) => {
      // 置顶的排在前面
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // 如果置顶状态相同，按更新时间排序（新的在前）
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [prompts, categoryId, tag, searchTerm, showFavoritesOnly]);
  
  // 处理提示词点击
  const handlePromptClick = (prompt: Prompt) => {
    if (onPromptClick) {
      onPromptClick(prompt);
    }
  };
  
  return (
    <div>
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">{t('prompt.noPrompts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map(prompt => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onClick={() => handlePromptClick(prompt)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptList; 