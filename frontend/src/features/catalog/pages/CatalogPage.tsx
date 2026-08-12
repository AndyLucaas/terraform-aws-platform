import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useToast } from '@/shared/ui/Toast';
import {
  useCatalogCategories,
  useCatalogTags,
  useCreateCategory,
  useCreateTag,
  useDeleteCategory,
  useDeleteTag,
} from '../hooks';

export function CatalogPage() {
  const { push } = useToast();
  const { data: categories } = useCatalogCategories();
  const { data: tags } = useCatalogTags();
  const createCategory = useCreateCategory();
  const createTag = useCreateTag();
  const deleteCategory = useDeleteCategory();
  const deleteTag = useDeleteTag();

  const [categoryName, setCategoryName] = useState('');
  const [tagName, setTagName] = useState('');

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    await createCategory.mutateAsync({ name: categoryName });
    push({ tone: 'success', title: 'Catégorie créée' });
    setCategoryName('');
  };

  const handleAddTag = async () => {
    if (!tagName.trim()) return;
    await createTag.mutateAsync({ name: tagName });
    push({ tone: 'success', title: 'Tag créé' });
    setTagName('');
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Catégories & tags</h1>
        <p className="text-sm text-text-secondary">Référentiels utilisés pour classifier les tickets</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Catégories</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nouvelle catégorie" />
              <Button onClick={handleAddCategory} loading={createCategory.isPending}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {categories && categories.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {categories.map((category) => (
                  <li key={category.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span className="text-sm text-text-primary">{category.name}</span>
                    <button onClick={() => deleteCategory.mutate(category.id)} className="text-text-secondary hover:text-error">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Aucune catégorie" />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="Nouveau tag" />
              <Button onClick={handleAddTag} loading={createTag.isPending}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags && tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center gap-1.5">
                    <Badge colorHex={tag.colorHex}>{tag.name}</Badge>
                    <button onClick={() => deleteTag.mutate(tag.id)} className="text-text-secondary hover:text-error">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Aucun tag" />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
