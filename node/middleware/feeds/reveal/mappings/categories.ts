/* eslint-disable @typescript-eslint/camelcase */
const toRevealCategory = (category: Category): RevealCategory => {
  return {
    category_eid: category.id.toString(),
    level: category.level,
    margin: 0,
    name: category.name,
    parent_category_eid: category.parent?.toString(),
    url: category.url,
  }
}

const categoryFeed = async (
  catalogSystem: any
): Promise<RevealCategoryFeed> => {
  const categoryTree = await catalogSystem.getAllCategories()
  const categoryQueue: Category[] = []
  categoryTree.forEach((category: any) => {
    categoryQueue.push({
      ...category,
      level: 0,
      parent: null,
    })
  })

  const flattenedCategoryTree: RevealCategory[] = []

  while (categoryQueue.length !== 0) {
    const curent = categoryQueue.pop() as Category

    if (curent?.hasChildren) {
      curent.children.forEach(child =>
        categoryQueue.push({
          ...child,
          level: curent.level + 1,
          parent: curent.id,
        })
      )
    }

    flattenedCategoryTree.push(toRevealCategory(curent))
  }

  return { categories: flattenedCategoryTree }
}

export default categoryFeed
