package com.itdesk.platform.service;

import com.itdesk.platform.dto.ticket.CategoryResponse;
import com.itdesk.platform.entity.Category;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.CategoryMapper;
import com.itdesk.platform.repository.CategoryRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> findAllRootCategories() {
        return categoryMapper.toResponseList(categoryRepository.findByParentIsNull());
    }

    @Transactional
    public CategoryResponse create(@NotBlank String name, Long parentId) {
        Category parent = null;
        if (parentId != null) {
            parent = categoryRepository.findById(parentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Catégorie parente introuvable : " + parentId));
        }
        Category category = Category.builder().name(name).parent(parent).build();
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Catégorie introuvable : " + id);
        }
        categoryRepository.deleteById(id);
    }
}
