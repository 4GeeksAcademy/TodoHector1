import React, { useState, useEffect } from 'react';

const Home = () => {
    const [tarea, setTarea] = useState("");
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [editandoId, setEditandoId] = useState(null);
    const [valorEditado, setValorEditado] = useState(""); 


	const postEnv ='https://playground.4geeks.com/todo/todos/hector';
	const delte = 'https://playground.4geeks.com/todo/todos/';
    const baseUrl = 'https://playground.4geeks.com/todo/todos/hector';

    
    useEffect(() => {
        const obtenerTareas = async () => {
            try {
                const res = await fetch(baseUrl);
                if (res.ok) {
                    const data = await res.json();
                    
                    setLista(data.todos || []); 
                }

                setCargando(false);
            } catch (error) {
                console.log("Error cargando tareas:", error);
                setCargando(false);
            }
        };
        obtenerTareas();
    }, []);


    const guardarCambios = async (id) => {
    try {
        const res = await fetch(`${delte}${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ label: valorEditado, is_done: false })
        });

        if (res.ok) {
            const tareaActualizada = await res.json();
            setLista(lista.map(item => item.id === id ? tareaActualizada : item));
            setEditandoId(null);
        }
        
    } catch (error) {
        console.log("Error al editar:", error);
    }
};

    const agregarTarea = async (e) => {

		e.preventDefault();
		if (tarea.trim() === "") return; 

        try {

			console.log('Agregando Tarea');
			const agre = await fetch (postEnv, {
			method: 'POST',
			headers: {
                "Content-Type": "application/json"
            },
			body: JSON.stringify({
                label: tarea,
                is_done: false
            })
			});
			const nuevaTarea = await agre.json();
			setLista([...lista, nuevaTarea]); 
			setTarea("");
 
		}catch{
			console.log('Hay un error');
		}
		console.log('se ha recibido');
    };

    const eliminarTarea = async (idAEliminar) => {

    try {
        const deltet = await fetch(`${delte}${idAEliminar}`, {
            method: 'DELETE'
        });


        if (deltet.ok) {
            console.log('Tarea eliminada en servidor');

            const nuevaLista = lista.filter((item) => item.id !== idAEliminar);
            setLista(nuevaLista);
        } else {
            console.log('El servidor no pudo borrar la tarea');
        }
    } catch (err) {
        console.log('Hay un error', err);
    }
}

    const editarTarea = async (id, nuevoTexto) => {

    try {
        const res = await fetch(`${delte}${id}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                label: nuevoTexto,
                is_done: false
            })
        });

        if (res.ok) {
            const tareaEditada = await res.json();
            setLista(lista.map(item => item.id === id ? tareaEditada : item));
        }
    } catch (error) {
        console.log("Error al editar:", error);
    }
    }

    const marcarCompletada = async (tarea) => {
        try {
            const res = await fetch(`${delte}${tarea.id}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    label: tarea.label, 
                    is_done: !tarea.is_done
                })
            });

            if (res.ok) {
                const tareaActualizada = await res.json();
                // Actualizamos la lista local
                setLista(lista.map(item => item.id === tarea.id ? tareaActualizada : item));
            }
        } catch (error) {
            console.log("Error al actualizar estado:", error);
        }
    };
        


    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <style>{`
                .item-tarea .btn-oculto {
                    opacity: 0;
                    transition: opacity 0.2s;
                }
                .item-tarea:hover .btn-oculto {
                    opacity: 1;
                }
            `}</style>

            <h2 className="text-center">Mis Tareas</h2>

            {cargando ? (
                <div className="progress mb-3">
                    <div 
                        className="progress-bar progress-bar-striped progress-bar-animated" 
                        role="progressbar" 
                        style={{ width: '100%' }}
                    >
                        Cargando tareas...
                    </div>
                </div>
            ) : (
                <>
                    <form onSubmit={agregarTarea} className="d-flex mb-3">
                        <input 
                            type="text" 
                            className="form-control me-2"
                            placeholder="Escribe una tarea..."
                            value={tarea}
                            onChange={(e) => setTarea(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">Añadir</button>
                    </form>

            <ul className="list-group">
                    {lista.map((item) => (
                        <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center item-tarea">
                            
                          
                            <span style={{ textDecoration: item.is_done ? 'line-through' : 'none' }}>
                                {item.label}
                            </span>

                            <div>
                                
                                <button 
                                    className={`btn btn-sm me-2 ${item.is_done ? 'btn-success' : 'btn-outline-secondary'}`}
                                    onClick={() => marcarCompletada(item)}
                                >
                                    {item.is_done ? '✓' : '○'} 
                                </button>

                                {/* BOTÓN DE BORRAR (X) */}
                                <button 
                                    className="btn btn-danger btn-sm" 
                                    onClick={() => eliminarTarea(item.id)}
                                >
                                    X
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                    
                {lista.length === 0 && <p className="text-center mt-3">No hay tareas pendientes.</p>}
            </>
            )}
        </div>
    );
}

export default Home;