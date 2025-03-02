import i18n from '../i18n/config';

/**
 * 获取当前语言代码
 * @returns {string} 当前语言代码
 */
export const getCurrentLanguage = () => {
  return i18n.language.split('-')[0];
};

/**
 * 获取本地化文本（现在只是直接返回文本，不做多语言处理）
 * @param {string} text - 文本字符串
 * @returns {string} 相同的文本字符串
 */
export const getLocalizedText = (text) => {
  if (!text) return '';
  return text;
};

/**
 * 创建文本（现在只是直接返回输入的文本，不创建多语言对象）
 * @param {string} text - 文本
 * @returns {string} 相同的文本
 */
export const createI18nText = (text) => {
  return text;
};

/**
 * 更新文本（现在只是直接返回新文本，不更新多语言对象）
 * @param {string} _currentText - 当前文本（不使用）
 * @param {string} _lang - 语言代码（不使用）
 * @param {string} newText - 新文本
 * @returns {string} 新文本
 */
export const updateI18nText = (_currentText, _lang, newText) => {
  return newText;
};

/**
 * 获取文本的字符长度（考虑中文字符）
 * @param {string} text - 文本
 * @returns {number} 字符长度
 */
export const getTextLength = (text) => {
  if (!text) return 0;
  
  // 中文字符通常是英文字符宽度的2倍
  // 这里简单考虑一下中文字符的计算
  let length = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    // 判断是否是中文字符（简单判断：Unicode范围）
    if (/[\u4e00-\u9fa5]/.test(char)) {
      length += 2;
    } else {
      length += 1;
    }
  }
  
  return length;
};

/**
 * 获取文本摘要（考虑中文字符）
 * @param {string} text - 文本
 * @param {number} [maxLength=50] - 最大长度
 * @returns {string} 摘要文本
 */
export const getSummary = (text, maxLength = 50) => {
  if (!text) return '';
  
  let length = 0;
  let summaryEnd = text.length;
  
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (/[\u4e00-\u9fa5]/.test(char)) {
      length += 2;
    } else {
      length += 1;
    }
    
    if (length > maxLength) {
      summaryEnd = i;
      break;
    }
  }
  
  if (summaryEnd < text.length) {
    return text.substring(0, summaryEnd) + '...';
  }
  
  return text;
}; 