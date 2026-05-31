import React, { useState, useEffect } from 'react';

const Home = () => {
    const [tarea, setTarea] = useState("");
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [editandoId, setEditandoId] = useState(null); // ID de la tarea que se está editando
    const [valorEditado, setValorEditado] = useState("");

  /*   const API_URL = 'https://playground.4geeks.com/todo/todos/hector'; */
  const API_URL = 'https://playground.4geeks.com/todo/users/hector1';

  useEffect(() => {
    const inicializarUsuario = async () => {
        setCargando(true);
        try {
            // 1. Intentamos crear el usuario
            const resUser = await fetch('https://playground.4geeks.com/todo/users/hector1', {
                method: 'POST',
                headers: { "Content-Type": "application/json" }
            });
            
            // Si es 400, no pasa nada, el usuario ya existe. 
            // Si es otro error, sí lanzamos alerta.
            if (resUser.status !== 201 && resUser.status !== 400) {
                console.error("Error al crear usuario");
            }

            // 2. Ahora cargamos las tareas
            const resTodos = await fetch('https://playground.4geeks.com/todo/todos/hector1');
            
            if (resTodos.ok) {
                const data = await resTodos.json();
                setLista(data.todos || []);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setCargando(false);
        }
    };
    inicializarUsuario();
}, []);


    const agregarTarea = async (e) => {
    e.preventDefault();
    console.log("Intentando agregar:", tarea); // 1. Ver si entra al evento

    if (tarea.trim() === "") return;

    try {
        const res = await fetch('https://playground.4geeks.com/todo/todos/hector1', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: tarea, is_done: false })
        });

        const data = await res.json();
        console.log("Respuesta del servidor:", data); // 2. Ver qué dice el servidor exactamente

        if (res.ok) {
            // Actualizar localmente sin volver a llamar a la API para descartar fallos de red
            setLista([...lista, data]); 
            setTarea("");
        }
    } catch (error) { 
        console.error('Error crítico:', error); 
    }
};

    const eliminarTarea = async (idAEliminar) => {
        try {
            const res = await fetch(`https://playground.4geeks.com/todo/todos/${idAEliminar}`, { method: 'DELETE' });
            if (res.ok) {
                setLista(lista.filter((item) => item.id !== idAEliminar));
            }
        } catch (err) { console.log('Error al borrar', err); }
    };


    const guardarEdicion = async (id, nuevoLabel) => {
    try {
        const res = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: 'PUT', // El método para actualizar es PUT
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: nuevoLabel, is_done: false })
        });

        if (res.ok) {
            // Actualizamos la lista localmente
            setLista(lista.map(item => item.id === id ? { ...item, label: nuevoLabel } : item));
            setEditandoId(null); // Salimos del modo edición
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
    }
};

const eliminarTodo = async () => {
    // La API de 4Geeks requiere borrar una por una o borrar el usuario.
    // Lo más sencillo es un bucle que elimine cada ID de la lista actual.
    for (const item of lista) {
        await fetch(`https://playground.4geeks.com/todo/todos/${item.id}`, { method: 'DELETE' });
    }
    setLista([]);
};

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="text-center">Mis Tareas</h2>
            
            {/* Formulario para añadir */}
            <form onSubmit={agregarTarea} className="d-flex mb-3">
                <input 
                    className="form-control"
                    value={tarea}
                    onChange={(e) => setTarea(e.target.value)}
                    placeholder="Añadir tarea..."
                />
                <button className="btn btn-primary ms-2" type="submit">Añadir</button>
            </form>

            {/* Lista de tareas */}
            <ul className="list-group">
                {lista.map((item) => (
                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {editandoId === item.id ? (
                            <input 
                                className="form-control"
                                value={valorEditado}
                                onChange={(e) => setValorEditado(e.target.value)}
                                onBlur={() => guardarEdicion(item.id, valorEditado)}
                                autoFocus
                            />
                        ) : (
                            <span onClick={() => { setEditandoId(item.id); setValorEditado(item.label); }}>
                                {item.label}
                            </span>
                        )}
                        <div>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditandoId(item.id); setValorEditado(item.label); }}>Editar</button>
                            <button className="btn btn-danger btn-sm" onClick={() => eliminarTarea(item.id)}>X</button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Botón borrar todo */}
            <button className="btn btn-outline-danger mt-3 w-100" onClick={eliminarTodo}>Borrar todas las tareas</button>
        </div>
    );
};

export default Home;