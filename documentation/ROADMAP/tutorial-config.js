// ==========================================
// tutorial-config.js
// Configuration pour l'application tutorielle JSONPlaceholder
// ==========================================

// ==========================================
// PROPERTY SETS - Définitions des champs
// ==========================================

/**
 * PropertySet pour User
 */
export const UserPropertySet = [
    {
        name: 'id',
        type: 'number',
        description: 'ID',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'name',
        type: 'text',
        description: 'Nom complet',
        default: '',
        options: { placeholder: 'Nom de l\'utilisateur' }
    },
    {
        name: 'username',
        type: 'text',
        description: 'Pseudo',
        default: '',
        options: { placeholder: 'Username' }
    },
    {
        name: 'email',
        type: 'email',
        description: 'Email',
        default: '',
        options: { placeholder: 'email@example.com' }
    },
    {
        name: 'phone',
        type: 'tel',
        description: 'Téléphone',
        default: '',
        options: { placeholder: '1-770-736-8031' }
    },
    {
        name: 'website',
        type: 'text',
        description: 'Site web',
        default: '',
        options: { placeholder: 'https://...' }
    }
]

export const UserComputePropertySet = []

/**
 * PropertySet pour Post
 */
export const PostPropertySet = [
    {
        name: 'id',
        type: 'number',
        description: 'ID',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'userId',
        type: 'number',
        description: 'ID Utilisateur',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'title',
        type: 'text',
        description: 'Titre',
        default: '',
        options: { placeholder: 'Titre de l\'article' }
    },
    {
        name: 'body',
        type: 'text',
        description: 'Contenu',
        default: '',
        options: { placeholder: 'Contenu de l\'article' }
    }
]

export const PostComputePropertySet = []

/**
 * PropertySet pour Comment
 */
export const CommentPropertySet = [
    {
        name: 'id',
        type: 'number',
        description: 'ID',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'postId',
        type: 'number',
        description: 'ID Article',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'name',
        type: 'text',
        description: 'Nom',
        default: '',
        options: { placeholder: 'Nom du commentaire' }
    },
    {
        name: 'email',
        type: 'email',
        description: 'Email',
        default: '',
        options: { placeholder: 'email@example.com' }
    },
    {
        name: 'body',
        type: 'text',
        description: 'Commentaire',
        default: '',
        options: { placeholder: 'Votre commentaire' }
    }
]

export const CommentComputePropertySet = []

/**
 * PropertySet pour Todo (Task)
 */
export const TodoPropertySet = [
    {
        name: 'id',
        type: 'number',
        description: 'ID',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'userId',
        type: 'number',
        description: 'ID Utilisateur',
        default: 0,
        options: { readonly: true }
    },
    {
        name: 'title',
        type: 'text',
        description: 'Tâche',
        default: '',
        options: { placeholder: 'Description de la tâche' }
    },
    {
        name: 'completed',
        type: 'checkbox',
        description: 'Terminée',
        default: false,
        options: {}
    }
]

export const TodoComputePropertySet = []

// ==========================================
// TEMPLATES - Affichage dans les listes
// ==========================================

/**
 * Template pour afficher un User
 */
export function user_TemplateLi(user) {
    return `👤 <strong>${user.name}</strong> (@${user.username}) - ${user.email}`
}

/**
 * Template pour afficher un Post
 */
export function post_TemplateLi(post) {
    return `📝 <strong>${post.title}</strong> - User #${post.userId}`
}

/**
 * Template pour afficher un Comment
 */
export function comment_TemplateLi(comment) {
    return `💬 ${comment.name} (${comment.email}) - Post #${comment.postId}`
}

/**
 * Template pour afficher un Todo
 */
export function todo_TemplateLi(todo) {
    const icon = todo.completed ? '✅' : '⬜'
    return `${icon} <strong>${todo.title}</strong> - User #${todo.userId}`
}

// ==========================================
// DATA SOURCES - Configuration des endpoints
// ==========================================

export const TutorialDataSources = [
    // === USERS ===
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'user',
        dataAction: 'readall',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/users',
        request: {
            linked: [],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'user',
        dataAction: 'read',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/users/{selectedUser}',
        request: {
            linked: ['selectedUser'],
            auth: false,
            key: false
        }
    },
    
    // === POSTS ===
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'post',
        dataAction: 'readall',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/posts',
        request: {
            linked: [],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'post',
        dataAction: 'read',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/posts/{selectedPost}',
        request: {
            linked: ['selectedPost'],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'post',
        dataAction: 'readByUser',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/users/{selectedUser}/posts',
        request: {
            linked: ['selectedUser'],
            auth: false,
            key: false
        }
    },
    
    // === COMMENTS ===
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'comment',
        dataAction: 'readall',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/comments',
        request: {
            linked: [],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'comment',
        dataAction: 'read',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/comments/{selectedComment}',
        request: {
            linked: ['selectedComment'],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'comment',
        dataAction: 'readByPost',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/posts/{selectedPost}/comments',
        request: {
            linked: ['selectedPost'],
            auth: false,
            key: false
        }
    },
    
    // === TODOS (TASKS) ===
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'todo',
        dataAction: 'readall',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/todos',
        request: {
            linked: [],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'todo',
        dataAction: 'read',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/todos/{selectedTodo}',
        request: {
            linked: ['selectedTodo'],
            auth: false,
            key: false
        }
    },
    {
        dataProvider: 'jsonplaceholder',
        dataSource: 'todo',
        dataAction: 'readByUser',
        dataMethod: 'get',
        url: 'https://jsonplaceholder.typicode.com/users/{selectedUser}/todos',
        request: {
            linked: ['selectedUser'],
            auth: false,
            key: false
        }
    }
]

// ==========================================
// EXPORT PAR DÉFAUT
// ==========================================

export default {
    // PropertySets
    UserPropertySet,
    UserComputePropertySet,
    PostPropertySet,
    PostComputePropertySet,
    CommentPropertySet,
    CommentComputePropertySet,
    TodoPropertySet,
    TodoComputePropertySet,
    
    // Templates
    user_TemplateLi,
    post_TemplateLi,
    comment_TemplateLi,
    todo_TemplateLi,
    
    // DataSources
    TutorialDataSources
}
