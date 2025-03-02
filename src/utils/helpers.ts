import { v4 as uuidv4 } from 'uuid';
import { SupportedLanguage } from '../types';

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * 获取当前时间的ISO字符串
 */
export const getCurrentTime = (): string => {
  return new Date().toISOString();
};

/**
 * 简化后的文本处理函数
 * 直接返回输入的文本，不再创建多语言对象
 */
export const createI18nText = (text: string): string => {
  return text;
};

/**
 * 复制文本到剪贴板
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('复制到剪贴板失败:', error);
    return false;
  }
};

/**
 * 格式化日期时间
 */
export const formatDateTime = (isoString: string, locale: SupportedLanguage = 'en'): string => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', options);
};

/**
 * 搜索过滤函数
 */
export const searchFilter = <T extends { [key: string]: any }>(
  items: T[],
  searchTerm: string,
  fields: string[]
): T[] => {
  if (!searchTerm) return items;
  
  const lowerSearchTerm = searchTerm.toLowerCase().trim();
  
  return items.filter(item => {
    return fields.some(field => {
      const value = item[field];
      
      // 处理数组
      if (Array.isArray(value)) {
        return value.some(
          val => typeof val === 'string' && val.toLowerCase().includes(lowerSearchTerm)
        );
      }
      
      // 处理字符串
      return typeof value === 'string' && value.toLowerCase().includes(lowerSearchTerm);
    });
  });
};

/**
 * 本地存储工具
 */
export const localStorage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('从本地存储获取数据失败:', error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('保存数据到本地存储失败:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('从本地存储删除数据失败:', error);
    }
  },
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
};

/**
 * 导出数据为文件
 */
export const exportToFile = (data: any, fileName: string, fileType: 'json' | 'markdown' | 'text'): void => {
  let content = '';
  let mimeType = '';
  
  switch (fileType) {
    case 'json':
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      break;
    case 'markdown':
      // 简单转换为Markdown格式
      content = `# 导出的提示词\n\n`;
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          content += `## ${index + 1}. ${item.title || '无标题'}\n\n`;
          content += `${item.content || ''}\n\n`;
          if (item.description) {
            content += `> ${item.description}\n\n`;
          }
          if (item.tags && item.tags.length > 0) {
            content += `标签: ${item.tags.join(', ')}\n\n`;
          }
          content += `---\n\n`;
        });
      }
      mimeType = 'text/markdown';
      break;
    case 'text':
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          content += `${index + 1}. ${item.title || '无标题'}\n`;
          content += `${item.content || ''}\n\n`;
        });
      }
      mimeType = 'text/plain';
      break;
  }
  
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // 清理
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}; 