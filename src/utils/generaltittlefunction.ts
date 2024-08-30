export const TabTitle = (newTitle: string) => {
    return (document.title = newTitle);
}
export const metaTagByTitle = (newMetaTitle: string) => {
 return document.querySelector('meta[property="og:title"]')?.setAttribute("content", newMetaTitle);
}
export const metaTagByDesc = (newMetaDesc: string) => {
 return document.querySelector('meta[property="og:description"]')?.setAttribute("content", newMetaDesc);
}
export const metaTagByKey = (newMetaKey: string) => {
 return document.querySelector('meta[name="keyword"]')?.setAttribute("content", newMetaKey);
}
export const metaTagByWeb = (newMetaWeb: string) => {
 return document.querySelector('meta[property="og:url"]')?.setAttribute("content", newMetaWeb);
}