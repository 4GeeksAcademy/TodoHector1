import React, { useState, useEffect } from 'react';

const Home = () => {
    const [tarea, setTarea] = useState("");
    const [lista, setLista] = useState([]);
    const [cargando, setCargando] = useState(true); 


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
                        {lista.map((item, index) => (
                            <li key={item.id || index} className="list-group-item d-flex justify-content-between align-items-center item-tarea">
                                {item.label}
                                <button 
                                    className="btn btn-danger btn-sm btn-oculto"
                                    onClick={() => eliminarTarea(item.id)}
                                >
                                    X
                                </button>
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