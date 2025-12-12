import type { Article } from "../api/articles";
import { fetchArticles, createArticle, updateArticle, deleteArticle as deleteArticleApi } from "../api/articles";

export const loadArticles = fetchArticles;

export const upsertArticle = async (article: Article) => {
  if (article.id) {
    await updateArticle(article.id, article);
  } else {
    await createArticle(article);
  }
  return fetchArticles();
};

export const deleteArticle = async (id: string | number) => {
  await deleteArticleApi(id);
  return fetchArticles();
};
