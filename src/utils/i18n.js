import i18n from '../i18n/config';

/**
 * 获取当前语言代码
 * @returns {string} 当前语言代码
 */
export const getCurrentLanguage = () => {
  return i18n.language.split('-')[0];
};

/**
 * 从多语言对象中获取当前语言的文本
 * @param {object} i18nText - 多语言文本对象
 * @param {string} [fallbackLang='en'] - 回退语言
 * @returns {string} 当前语言的文本
 */
export const getLocalizedText = (i18nText, fallbackLang = 'en') => {
  if (!i18nText) return '';
  
  const currentLang = getCurrentLanguage();
  
  // 如果存在当前语言的文本，返回它
  if (i18nText[currentLang]) {
    return i18nText[currentLang];
  }
  
  // 否则返回回退语言的文本
  return i18nText[fallbackLang] || '';
};

/**
 * 创建新的多语言文本对象
 * @param {string} enText - 英文文本
 * @param {string} zhText - 中文文本
 * @returns {object} 多语言文本对象
 */
export const createI18nText = (enText, zhText = '') => {
  return {
    en: enText,
    zh: zhText || enText // 如果没有提供中文，默认使用英文
  };
};

/**
 * 更新多语言文本对象的特定语言文本
 * @param {object} i18nText - 多语言文本对象
 * @param {string} lang - 语言代码
 * @param {string} text - 新文本
 * @returns {object} 更新后的多语言文本对象
 */
export const updateI18nText = (i18nText, lang, text) => {
  return {
    ...i18nText,
    [lang]: text
  };
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