package com.itdesk.platform.dto.comment;

import jakarta.validation.constraints.NotBlank;

public record CommentCreateRequest(

        @NotBlank(message = "Le contenu du commentaire est obligatoire")
        String content,

        boolean internal
) {
}
