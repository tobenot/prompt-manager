import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from '../../types';
import { formatDateTime, copyToClipboard } from '../../utils/helpers';
import { usePromptStore } from '../../store';

interface PromptCardProps {
  prompt: Prompt;
  onClick?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  const { t } = useTranslation('common');
  const { toggleFavorite, togglePin, incrementUsage, categories } = usePromptStore();
  const [isHovering, setIsHovering] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // 直接使用字符串格式的标题和描述
  const title = prompt.title || t('prompt.untitled');
  const description = prompt.description || '';

  // 获取分类信息
  const category = categories.find(c => c.id === prompt.categoryId);
  
  // 处理复制到剪贴板
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const success = await copyToClipboard(prompt.content);
    
    if (success) {
      // 增加使用次数
      incrementUsage(prompt.id);
      
      // 显示复制成功状态
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } else {
      // 显示失败提示
      alert(t('message.copyFailed'));
    }
  };
  
  // 处理收藏
  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(prompt.id);
  };
  
  // 处理置顶
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePin(prompt.id);
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
    <div 
      className="card group hover:shadow-md transition-all duration-200 cursor-pointer card-hover animate-fade-in"
      onClick={onClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        borderLeft: `3px solid ${category?.color || '#e2e8f0'}`
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-2">
          {category && (
            <span 
              className="text-lg mt-0.5" 
              style={{ color: category.color }}
              title={category.name}
            >
              {getCategoryIcon(category.icon || 'folder')}
            </span>
          )}
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
        <div className="flex gap-1.5">
          {prompt.isPinned && (
            <button 
              className="text-primary hover:scale-110 transition-transform"
              title={t('prompt.pinned')}
              onClick={handlePin}
            >
              📌
            </button>
          )}
          <button 
            className={`${prompt.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 hover:scale-110 transition-all`}
            title={prompt.isFavorite ? t('actions.unfavorite') : t('actions.favorite')}
            onClick={handleFavorite}
          >
            {prompt.isFavorite ? '★' : '☆'}
          </button>
        </div>
      </div>
      
      {description && (
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 group-hover:text-foreground/90 transition-colors">
          {description}
        </p>
      )}
      
      {prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {prompt.tags.map((tag) => (
            <span 
              key={tag} 
              className="tag group-hover:bg-primary/10 group-hover:text-primary transition-colors"
            >
              <span className="opacity-70 mr-0.5">#</span>
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/40">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5 group-hover:text-foreground/70 transition-colors">
          <span role="img" aria-label="usage count" className="opacity-70">🔄</span>
          {t('prompt.usedTimes', { count: prompt.usageCount })}
        </span>
        
        <div className="flex gap-2">
          <button 
            className={`btn btn-ghost btn-xs ${isCopied ? 'text-green-500' : ''}`}
            onClick={handleCopy}
            title={t('actions.copy')}
          >
            {isCopied ? t('actions.copied') : t('actions.copy')}
          </button>
          
          {isHovering && (
            <button 
              className="btn btn-outline btn-xs animate-scale-in"
              onClick={onClick}
              title={t('actions.edit')}
            >
              {t('actions.edit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptCard; 