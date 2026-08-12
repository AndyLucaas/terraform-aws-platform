package com.itdesk.platform.repository;

import com.itdesk.platform.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    Page<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId, Pageable pageable);
}
