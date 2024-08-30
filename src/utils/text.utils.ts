// Copy text to Clipboard
export const copyTextToClipboard = (text: string) => {
  const elem = document.createElement('textarea');
  elem.value = text;
  document.body.appendChild(elem);
  elem.select();
  document.execCommand('copy');
  document.body.removeChild(elem);
};

export const  convertToKebabCase = (s: string) => {
  return s?.toLowerCase().replace(/[()?]/g, '').replace(/ /g, '-');
};


export const plainToHtml = (plain: string) => {
    return plain.replace(/\r?\n/g, '<br />');
}
