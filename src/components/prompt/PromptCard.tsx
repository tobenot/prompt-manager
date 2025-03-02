import React from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from '../../types';
import { formatDateTime, copyToClipboard } from '../../utils/helpers';
import { usePromptStore } from '../../store';

interface PromptCardProps {
  prompt: Prompt;
  onClick?: () => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  const { t, i18n } = useTranslation('common');
  const { toggleFavorite, togglePin, incrementUsage } = usePromptStore();
  
  // 获取当前语言的内容
  const currentLang = i18n.language as 'en' | 'zh';
  const title = prompt.title[currentLang] || prompt.title.en || prompt.title.zh || t('prompt.untitled');
  const description = prompt.description?.[currentLang] || prompt.description?.en || prompt.description?.zh || '';
  
  // 处理复制到剪贴板
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const content = prompt.content[currentLang] || prompt.content.en || prompt.content.zh || '';
    const success = await copyToClipboard(content);
    
    if (success) {
      // 增加使用次数
      incrementUsage(prompt.id);
      
      // 显示成功提示
      alert(t('message.copied'));
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
  
  return (
    <div 
      className="card group hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex gap-1">
          {prompt.isPinned && (
            <span 
              className="text-primary"
              title={t('prompt.pinned')}
              onClick={handlePin}
            >
              📌
            </span>
          )}
          <span 
            className={`${prompt.isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500 transition-colors`}
            title={prompt.isFavorite ? t('actions.unfavorite') : t('actions.favorite')}
            onClick={handleFavorite}
          >
            {prompt.isFavorite ? '★' : '☆'}
          </span>
        </div>
      </div>
      
      {description && (
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2 mb-3">
        {prompt.tags.map((tag) => (
          <span 
            key={tag} 
            className="badge bg-muted text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-muted-foreground">
          {t('prompt.usedTimes', { count: prompt.usageCount })}
        </span>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-ghost btn-sm"
            onClick={handleCopy}
            title={t('actions.copy')}
          >
            {t('actions.copy')}
          </button>
          <button 
            className="btn btn-outline btn-sm"
            onClick={onClick}
            title={t('actions.edit')}
          >
            {t('actions.edit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard; 