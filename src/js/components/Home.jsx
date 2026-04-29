import React, { useState } from 'react';

const Home = () => {
    const [tarea, setTarea] = useState("");
    const [lista, setLista] = useState([]); 


	const postEnv ='https://playground.4geeks.com/todo/users/hector';
	const delte = 'https://playground.4geeks.com/todo/todos/';

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
			
			setLista([...lista, tarea]); 
			setTarea("");
 
		}catch{
			console.log('Hay un error');
		}
		console.log('se ha recibido');
    };

    const eliminarTarea = async (indiceAEliminar) => {

		try{
			const agre = await fetch (delte'{indiceAEliminar}', {
			method: 'DELETE'

		}catch{

			console.log('Hay un error');
		}

        const nuevaLista = lista.filter((_, index) => index !== indiceAEliminar);
        setLista(nuevaLista);
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
                
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center item-tarea">
                        {item}
                        <button 
                            
                            className="btn btn-danger btn-sm btn-oculto"
                            onClick={() => eliminarTarea(index)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
            
            {lista.length === 0 && <p className="text-center mt-3">No hay tareas pendientes.</p>}
        </div>
    );
};

export default Home;