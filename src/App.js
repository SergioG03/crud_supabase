// src/App.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [post, setPost] = useState({ title: '', body: '' });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // Para guardar el ID del post que se está editando

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      alert('Error al cargar los posts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function createPost(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('posts')
        .insert([{ title: post.title, body: post.body }]);

      if (error) throw error;
      
      setPost({ title: '', body: '' });
      fetchPosts();
    } catch (error) {
      alert('Error al crear el post');
      console.error(error);
    }
  }

  async function updatePost(e) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('posts')
        .update({ title: post.title, body: post.body })
        .eq('id', editing);

      if (error) throw error;
      
      setPost({ title: '', body: '' });
      setEditing(null);
      fetchPosts();
    } catch (error) {
      alert('Error al actualizar el post');
      console.error(error);
    }
  }

  async function deletePost(id) {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      alert('Error al eliminar el post');
      console.error(error);
    }
  }

  function handleEdit(postToEdit) {
    setPost({ title: postToEdit.title, body: postToEdit.body });
    setEditing(postToEdit.id);
  }

  function handleCancel() {
    setPost({ title: '', body: '' });
    setEditing(null);
  }

  return (
    <div className="container">
      <h1>Posts CRUD</h1>

      <form onSubmit={editing ? updatePost : createPost} className="form-container">
        <input
          type="text"
          placeholder="Título"
          value={post.title}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Contenido"
          value={post.body}
          onChange={(e) => setPost({ ...post, body: e.target.value })}
          required
        />
        <div className="button-group">
          <button type="submit">
            {editing ? 'Actualizar Post' : 'Crear Post'}
          </button>
          {editing && (
            <button type="button" onClick={handleCancel} className="cancel-button">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Cargando posts...</p>
      ) : (
        <div className="posts-container">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
              <div className="post-buttons">
                <button 
                  onClick={() => handleEdit(post)}
                  className="edit-button"
                >
                  Editar
                </button>
                <button 
                  onClick={() => deletePost(post.id)}
                  className="delete-button"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;