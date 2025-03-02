import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/layout/Sidebar';
import PromptList from '../components/prompt/PromptList';
import PromptForm from '../components/prompt/PromptForm';
import { Prompt } from '../types';
import { usePromptStore } from '../store';

const HomePage: React.FC = () => {
  const { t } = useTranslation('common');
  const { initialize } = usePromptStore();
  
  // 状态
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(false);
  const [isAddingPrompt, setIsAddingPrompt] = useState<boolean>(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await initialize();
      setIsLoading(false);
    };
    
    loadData();
  }, [initialize]);
  
  // 处理提示词点击
  const handlePromptClick = (prompt: Prompt) => {
    setEditingPrompt(prompt);
  };
  
  // 处理提示词表单提交
  const handlePromptSubmit = () => {
    setIsAddingPrompt(false);
    setEditingPrompt(undefined);
  };
  
  // 处理提示词表单取消
  const handlePromptCancel = () => {
    setIsAddingPrompt(false);
    setEditingPrompt(undefined);
  };
  
  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // 处理分类选择
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedTag(undefined);
    setShowFavorites(false);
  };
  
  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setSelectedCategoryId(undefined);
    setShowFavorites(false);
  };
  
  // 处理收藏选择
  const handleFavoritesSelect = () => {
    setShowFavorites(true);
    setSelectedCategoryId(undefined);
    setSelectedTag(undefined);
  };
  
  // 显示所有提示词
  const handleAllPromptsSelect = () => {
    setSelectedCategoryId(undefined);
    setSelectedTag(undefined);
    setShowFavorites(false);
  };
  
  // 清除搜索
  const clearSearch = () => {
    setSearchTerm('');
  };
  
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* 侧边栏 */}
      <Sidebar
        selectedCategoryId={selectedCategoryId}
        selectedTag={selectedTag}
        onCategorySelect={handleCategorySelect}
        onTagSelect={handleTagSelect}
        onFavoritesSelect={handleFavoritesSelect}
        onAllPromptsSelect={handleAllPromptsSelect}
      />
      
      {/* 主内容区 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <p>{t('message.loading')}</p>
          </div>
        ) : (
          <>
            {/* 标题栏 */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {showFavorites ? t('nav.favorites') : 
                  selectedCategoryId ? t('nav.categoryPrompts') : 
                  selectedTag ? `#${selectedTag}` : 
                  t('nav.allPrompts')}
              </h1>
              
              <div className="flex items-center space-x-4">
                {/* 搜索框 */}
                <div className="relative">
                  <input
                    type="text"
                    className="input pr-8"
                    placeholder={t('actions.search')}
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                  {searchTerm && (
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={clearSearch}
                    >
                      ×
                    </button>
                  )}
                </div>
                
                {/* 添加按钮 */}
                <button
                  className="btn btn-primary"
                  onClick={() => setIsAddingPrompt(true)}
                >
                  {t('actions.newPrompt')}
                </button>
              </div>
            </div>
            
            {/* 提示词表单 */}
            {(isAddingPrompt || editingPrompt) && (
              <div className="mb-8 p-6 bg-card rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">
                  {editingPrompt ? t('prompt.editPrompt') : t('prompt.newPrompt')}
                </h2>
                <PromptForm
                  prompt={editingPrompt}
                  onSubmit={handlePromptSubmit}
                  onCancel={handlePromptCancel}
                />
              </div>
            )}
            
            {/* 提示词列表 */}
            <PromptList
              categoryId={selectedCategoryId}
              tag={selectedTag}
              searchTerm={searchTerm}
              showFavoritesOnly={showFavorites}
              onPromptClick={handlePromptClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage; 