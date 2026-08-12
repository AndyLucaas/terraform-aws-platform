package com.itdesk.platform.service;

import com.itdesk.platform.dto.ticket.TagResponse;
import com.itdesk.platform.entity.Tag;
import com.itdesk.platform.exception.DuplicateResourceException;
import com.itdesk.platform.exception.ResourceNotFoundException;
import com.itdesk.platform.mapper.TagMapper;
import com.itdesk.platform.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    public List<TagResponse> search(String query) {
        List<Tag> tags = query == null || query.isBlank()
                ? tagRepository.findAll()
                : tagRepository.findByNameContainingIgnoreCase(query);
        return tags.stream().map(tagMapper::toResponse).toList();
    }

    @Transactional
    public TagResponse create(String name, String colorHex) {
        if (tagRepository.findByNameIgnoreCase(name).isPresent()) {
            throw new DuplicateResourceException("Le tag '" + name + "' existe déjà");
        }
        Tag tag = Tag.builder().name(name).colorHex(colorHex).build();
        return tagMapper.toResponse(tagRepository.save(tag));
    }

    @Transactional
    public void delete(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tag introuvable : " + id);
        }
        tagRepository.deleteById(id);
    }
}
