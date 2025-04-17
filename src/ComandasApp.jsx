import { useState, useEffect } from 'react';
import './ComandasApp.css';
import { Sandwich } from 'lucide-react';

const zonas = {
  Terraza: [1, 2, 3, 4, 5, 6],
  Salon: [11, 12, 13, 14, 15, 16, 17],
  Barra: [18, 19, 20, 21, 22, 23],
};

const categorias = {
  Bebidas: ["Café", "Refresco", "Zumo", "Agua", "Cerveza","Doble",
    "ColaCao","Sangria",
    "Tinto Verano", "Agua Gas", "Agua mineral", "Rioja", "Ribera", "Blanco seco", "Blanco Dulce", "Blanco semi Dulce", "Manzanilla vino", "Canasta",
    "Batidos de Piña",
    "Batidos de Melocotón",
    "Batidos de Chocolate",
    "Batidos de Fresa",
    "Batidos de Vainilla"],

  Infusiones: ["Manzanilla", "Tila", "Negro", "Menta Poleo", "Verde", "Especial"],
  Desayunos: ["Tostada", "Croissant", "Sandwich", "Bocadillo"],
  TapasFrias:["Ensaladilla", "Pata Alioli","Papa Aliñas", "Salmorejo", "Mini Anchoa", "Mini Sardina","Boquerones Vinagre", "Nacho Guacamole", "Tomate Aliñado", "Ventresca", "Wrap de pollo", "Mejillon Gigante", "Plato de patata", "Plato de aceituna", "Tabla Jamon", "Tabla Queso", "Tabla Mechada", "Tacos Veganos"],
  TapasCalientes:["Carrillada", "Espicanas Garbanzo", "Tortilla patata", "Pisto con Huevo", "Carne con tomate", "lomo al Whisky","Burrito Pollo"],
  Sandwich:["Vegetal Atun", "San Marcos", "Mixto"],
  Montaditos:["Piripi", "Gambas Alioli", "pollo Carbonara", "Lomo Roque", "Chori", "Rulo de Cabra", "Mini Serrano", "Mon Tortilla"],
  Bolleria:["Donut", "Cruasan", "Napolitana", "Crusan Mixto", "Crusan Serrano", "Tarta Casera", "Crusan ser&Que","Rosquilla", "Pastitas Arabes", "Magdalena"],
};

// Configuración para cafés
const tiposCafe = [
  "Cortado", "Solo", "Americano", "Con leche", "Manchado", "Avellanado", 
  "Capuchino", "Expreso", "Bombón"
];

const tiposLeche = [
  "Normal", "Sin lactosa", "Avena", "Soja"
];

const temperaturas = [
  "Caliente", "Templado", "Frío"
];

// Configuración para tostadas
const tiposPan = [
  "Mollete", "Bollito", "Integral"
];

const tamaniosTostada = [
  "Media", "Entera"
];

const toppings = [
  "York", "Jamón", "Pavo", "Queso", "Toma T", "Tomate Ro", "Aguacate", "Huevo", "Bacon", "Mantequilla", "Mermelada", "Pringa", "Choripicante", "Paté", "sin aceite"
];

export default function ComandasApp() {
  const [vistaActual, setVistaActual] = useState('zonas'); // 'zonas', 'pedido', 'resumen'
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  // Initialize pedidos from localStorage if available
  const [pedidos, setPedidos] = useState(() => {
    const savedPedidos = localStorage.getItem("comandas_pedidos");
    return savedPedidos ? JSON.parse(savedPedidos) : {};
  });
  const [mostrarModalCafe, setMostrarModalCafe] = useState(false);
  const [mostrarModalTostada, setMostrarModalTostada] = useState(false);

  useEffect(() => {
    const zonaGuardada = localStorage.getItem("zonaSeleccionada");
    const mesaGuardada = localStorage.getItem("mesaSeleccionada");
  
    if (zonaGuardada && mesaGuardada) {
      setZonaSeleccionada(zonaGuardada);
      setMesaSeleccionada(mesaGuardada);
      setVistaActual("pedido");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("comandas_pedidos", JSON.stringify(pedidos));
  }, [pedidos]);
  
  useEffect(() => {
    if (zonaSeleccionada && mesaSeleccionada) {
      localStorage.setItem("zonaSeleccionada", zonaSeleccionada);
      localStorage.setItem("mesaSeleccionada", mesaSeleccionada);
    }
  }, [zonaSeleccionada, mesaSeleccionada]);
  
  // Configuración para café
  const [configCafe, setConfigCafe] = useState({
    tipo: "Cortado", 
    leche: "Normal", 
    vasoTaza: "Vaso", 
    temperatura: "Caliente",
    cafeDescafeinado: "Café"
  });
  
  // Configuración para tostada
  const [configTostada, setConfigTostada] = useState({
    tipoPan: "Mollete",
    tamanio: "Entera",
    toppingsSeleccionados: []
  });

  const mesaKey = zonaSeleccionada && mesaSeleccionada ? `${zonaSeleccionada}-${mesaSeleccionada}` : null;
  const pedidoActual = mesaKey && pedidos[mesaKey] ? pedidos[mesaKey] : {};

  const seleccionarMesa = (zona, mesa) => {
    setZonaSeleccionada(zona);
    setMesaSeleccionada(mesa);
    setVistaActual('pedido');
    // Reset selected category when selecting a new table
    setCategoriaSeleccionada(null);
  };

  const agregarProducto = (producto) => {
    if (producto === "Café") {
      setMostrarModalCafe(true);
    } else if (producto === "Tostada") {
      setMostrarModalTostada(true);
    } else {
      if (!mesaKey) return;
      
      // Use functional update with a deep copy to ensure we're working with fresh state
      setPedidos(prevPedidos => {
        const newPedidos = JSON.parse(JSON.stringify(prevPedidos));
        
        if (!newPedidos[mesaKey]) {
          newPedidos[mesaKey] = {};
        }
        
        const currentCount = newPedidos[mesaKey][producto] || 0;
        newPedidos[mesaKey][producto] = currentCount + 1;
        
        return newPedidos;
      });
    }
  };

  const confirmarCafe = () => {
    if (!mesaKey) return;
    
    const cafeSeleccionado = `${configCafe.cafeDescafeinado} ${configCafe.tipo} ${configCafe.tipo !== 'Solo' && configCafe.tipo !== 'Expreso' ? `con leche ${configCafe.leche}` : ''}, en ${configCafe.vasoTaza}, ${configCafe.temperatura}`;
    
    // Use the same deep copy approach as in agregarProducto
    setPedidos(prevPedidos => {
      // Create a deep copy of the previous state
      const newPedidos = JSON.parse(JSON.stringify(prevPedidos));
      
      // Initialize the mesa object if needed
      if (!newPedidos[mesaKey]) {
        newPedidos[mesaKey] = {};
      }
      
      // Get current count and increment by exactly 1
      const currentCount = newPedidos[mesaKey][cafeSeleccionado] || 0;
      newPedidos[mesaKey][cafeSeleccionado] = currentCount + 1;
      
      return newPedidos;
    });
    
    setMostrarModalCafe(false);
  };
  

  const toggleTopping = (topping) => {
    setConfigTostada(prev => {
      const toppingsActualizados = [...prev.toppingsSeleccionados];
      if (toppingsActualizados.includes(topping)) {
        return {
          ...prev,
          toppingsSeleccionados: toppingsActualizados.filter(t => t !== topping)
        };
      } else {
        return {
          ...prev,
          toppingsSeleccionados: [...toppingsActualizados, topping]
        };
      }
    });
  };

  const confirmarTostada = () => {
    if (!mesaKey) return;
    
    let descripcionTostada = `Tostada de ${configTostada.tipoPan} ${configTostada.tamanio}`;
    
    if (configTostada.toppingsSeleccionados.length > 0) {
      descripcionTostada += ` con ${configTostada.toppingsSeleccionados.join(", ")}`;
    }
    
    // Use the same deep copy approach
    setPedidos(prevPedidos => {
      // Create a deep copy of the previous state
      const newPedidos = JSON.parse(JSON.stringify(prevPedidos));
      
      // Initialize the mesa object if needed
      if (!newPedidos[mesaKey]) {
        newPedidos[mesaKey] = {};
      }
      
      // Get current count and increment by exactly 1
      const currentCount = newPedidos[mesaKey][descripcionTostada] || 0;
      newPedidos[mesaKey][descripcionTostada] = currentCount + 1;
      
      return newPedidos;
    });
    
    // Resetear selección de toppings pero mantener pan y tamaño para próximas tostadas
    setConfigTostada(prev => ({
      ...prev,
      toppingsSeleccionados: []
    }));
    
    setMostrarModalTostada(false);
  };

  const eliminarProducto = (producto) => {
    if (!mesaKey) return;
    setPedidos(prev => {
      const actualizado = JSON.parse(JSON.stringify(prev));
      if (actualizado[mesaKey] && actualizado[mesaKey][producto]) {
        if (actualizado[mesaKey][producto] > 1) {
          actualizado[mesaKey][producto] -= 1;
        } else {
          delete actualizado[mesaKey][producto];
        }
      }
      return actualizado;
    });
  };

  const volverAZonas = () => {
    setVistaActual('zonas');
    setCategoriaSeleccionada(null);
  };

  const verResumen = () => {
    setVistaActual('resumen');
  };

  const contarTotalPedidos = (mesaKey) => {
    if (!pedidos[mesaKey]) return 0;
    return Object.values(pedidos[mesaKey]).reduce((total, cantidad) => total + cantidad, 0);
  };

  const renderResumenMesa = () => {
    return (
      <div className="resumen-mesa">
        <h3>Resumen de la Mesa</h3>
        {Object.entries(pedidoActual).length === 0 ? (
          <p className="sin-pedidos">No hay productos en esta mesa.</p>
        ) : (
          <ul className="lista-pedidos">
            {Object.entries(pedidoActual).map(([prod, qty]) => (
              <li key={prod} className="item-pedido">
                <div className="info-pedido">
                  <span className="cantidad-producto">{qty}x</span>
                  <span className="nombre-producto">{prod}</span>
                </div>
                <div className="acciones-pedido">
                  <button className="btn-eliminar" onClick={() => eliminarProducto(prod)}>
                    -
                  </button>
                  <button 
                    className="btn-agregar" 
                    onClick={() => {
                      if (!mesaKey) return;
                      setPedidos(prev => {
                        const newPedidos = JSON.parse(JSON.stringify(prev));
                        if (!newPedidos[mesaKey]) newPedidos[mesaKey] = {};
                        newPedidos[mesaKey][prod] = (newPedidos[mesaKey][prod] || 0) + 1;
                        return newPedidos;
                      });
                    }}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="comandas-app">
      <header className="app-header">
        <h1>Comandas</h1>
        {vistaActual !== 'zonas' && (
          <button className="btn-volver" onClick={volverAZonas}>
            Volver a Zonas
          </button>
        )}
      </header>

      {vistaActual === 'zonas' && (
        <div className="seleccion-zona">
          {Object.entries(zonas).map(([zona, mesas]) => (
            <div key={zona} className="zona-container">
              <h2 className="zona-titulo">{zona}</h2>
              <div className="mesas-grid">
                {mesas.map((mesa) => {
                  const key = `${zona}-${mesa}`;
                  const totalPedidos = contarTotalPedidos(key);
                  return (
                    <button
                      key={mesa}
                      className={`mesa-btn ${totalPedidos > 0 ? 'ocupada' : ''}`}
                      onClick={() => seleccionarMesa(zona, mesa)}
                    >
                      <span className="mesa-numero">{mesa}</span>
                      {totalPedidos > 0 && (
                        <span className="mesa-pedidos">{totalPedidos}</span>
                      )}
                    </button>

                    
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {vistaActual === 'pedido' && mesaKey && (
        <div className="pedido-container">
          <div className="info-mesa">
            <h2>{zonaSeleccionada} - Mesa {mesaSeleccionada}</h2>
            <button className="btn-resumen" onClick={verResumen}>
              Ver Resumen Completo
            </button>
          </div>

          {/* Show the summary first */}
          {renderResumenMesa()}

          <div className="categorias-tabs">
            {Object.keys(categorias).map((cat) => (
              <button 
                key={cat} 
                className={`categoria-tab ${categoriaSeleccionada === cat ? 'activa' : ''}`}
                onClick={() => setCategoriaSeleccionada(cat === categoriaSeleccionada ? null : cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Only show products for the selected category */}
          {categoriaSeleccionada && (
            <div className="productos-scroll">
              <div className="categoria-seccion">
                <h3 className="categoria-titulo">{categoriaSeleccionada}</h3>
                <div className="productos-grid">
                  {categorias[categoriaSeleccionada].map((item) => (
                    <button 
                      key={item} 
                      className="producto-btn" 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        agregarProducto(item);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {vistaActual === 'resumen' && mesaKey && (
        <div className="resumen-container">
          <h2>Resumen de Pedido</h2>
          <div className="info-mesa-resumen">
            <h3>{zonaSeleccionada} - Mesa {mesaSeleccionada}</h3>
          </div>

          {Object.entries(pedidoActual).length === 0 ? (
            <p className="sin-pedidos">No hay productos en esta mesa.</p>
          ) : (
            <ul className="lista-pedidos">
              {Object.entries(pedidoActual).map(([prod, qty]) => (
                <li key={prod} className="item-pedido">
                  <div className="info-pedido">
                    <span className="cantidad-producto">{qty}x</span>
                    <span className="nombre-producto">{prod}</span>
                  </div>
                  <div className="acciones-pedido">
                    <button className="btn-eliminar" onClick={() => eliminarProducto(prod)}>
                      -
                    </button>
                    <button 
                      className="btn-agregar" 
                      onClick={() => {
                        if (!mesaKey) return;
                        setPedidos(prev => {
                          const newPedidos = JSON.parse(JSON.stringify(prev));
                          if (!newPedidos[mesaKey]) newPedidos[mesaKey] = {};
                          newPedidos[mesaKey][prod] = (newPedidos[mesaKey][prod] || 0) + 1;
                          return newPedidos;
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="botones-accion">
            <button className="btn-volver-pedido" onClick={() => setVistaActual('pedido')}>
              Seguir pidiendo
            </button>
            <button className="btn-enviar">
              Enviar comanda
            </button>
          </div>
        </div>
      )}

      {/* Modal para configurar café */}
      {mostrarModalCafe && (
        <div className="modal-cafe">
          <div className="modal-contenido">
            <h3 className="modal-titulo">Personalizar Café</h3>

            <div className="opciones-seccion">
              <h4>Café o Descafeinado</h4>
              <div className="opciones-grid">
                {['Café', 'Descafeinado'].map(opcion => (
                  <button
                    key={opcion}
                    className={`opcion-btn ${configCafe.cafeDescafeinado === opcion ? 'seleccionado' : ''}`}
                    onClick={() => setConfigCafe({ ...configCafe, cafeDescafeinado: opcion })}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            <div className="opciones-seccion">
              <h4>Tipo de Café</h4>
              <div className="opciones-grid">
                {tiposCafe.map(tipo => (
                  <button
                    key={tipo}
                    className={`opcion-btn ${configCafe.tipo === tipo ? 'seleccionado' : ''}`}
                    onClick={() => setConfigCafe({ ...configCafe, tipo })}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            {configCafe.tipo !== 'Solo' && configCafe.tipo !== 'Expreso' && (
              <div className="opciones-seccion">
                <h4>Tipo de Leche</h4>
                <div className="opciones-grid">
                  {tiposLeche.map(leche => (
                    <button
                      key={leche}
                      className={`opcion-btn ${configCafe.leche === leche ? 'seleccionado' : ''}`}
                      onClick={() => setConfigCafe({ ...configCafe, leche })}
                    >
                      {leche}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="opciones-seccion">
              <h4>Vaso o Taza</h4>
              <div className="opciones-grid">
                {['Vaso', 'Taza'].map(opcion => (
                  <button
                    key={opcion}
                    className={`opcion-btn ${configCafe.vasoTaza === opcion ? 'seleccionado' : ''}`}
                    onClick={() => setConfigCafe({ ...configCafe, vasoTaza: opcion })}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            <div className="opciones-seccion">
              <h4>Temperatura</h4>
              <div className="opciones-grid">
                {temperaturas.map(temperatura => (
                  <button
                    key={temperatura}
                    className={`opcion-btn ${configCafe.temperatura === temperatura ? 'seleccionado' : ''}`}
                    onClick={() => setConfigCafe({ ...configCafe, temperatura })}
                  >
                    {temperatura}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setMostrarModalCafe(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarCafe}>
                Añadir Café
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para configurar tostada */}
      {mostrarModalTostada && (
        <div className="modal-tostada">
          <div className="modal-contenido">
            <h3 className="modal-titulo">Personalizar Tostada</h3>

            <div className="opciones-seccion">
              <h4>Tipo de Pan</h4>
              <div className="opciones-grid">
                {tiposPan.map(tipo => (
                  <button
                    key={tipo}
                    className={`opcion-btn ${configTostada.tipoPan === tipo ? 'seleccionado' : ''}`}
                    onClick={() => setConfigTostada({ ...configTostada, tipoPan: tipo })}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
            </div>

            <div className="opciones-seccion">
              <h4>Tamaño</h4>
              <div className="opciones-grid">
                {tamaniosTostada.map(tamanio => (
                  <button
                    key={tamanio}
                    className={`opcion-btn ${configTostada.tamanio === tamanio ? 'seleccionado' : ''}`}
                    onClick={() => setConfigTostada({ ...configTostada, tamanio })}
                  >
                    {tamanio}
                  </button>
                ))}
              </div>
            </div>

            <div className="opciones-seccion toppings-seccion">
              <h4>Ingredientes</h4>
              <div className="opciones-grid toppings-grid">
                {toppings.map(topping => (
                  <button
                    key={topping}
                    className={`opcion-btn ${configTostada.toppingsSeleccionados.includes(topping) ? 'seleccionado' : ''}`}
                    onClick={() => toggleTopping(topping)}
                  >
                    {topping}
                  </button>
                ))}
              </div>
            </div>

            <div className="toppings-seleccionados">
              <h4>Ingredientes seleccionados:</h4>
              {configTostada.toppingsSeleccionados.length === 0 ? (
                <p className="no-toppings">Ninguno seleccionado</p>
              ) : (
                <div className="toppings-tags">
                  {configTostada.toppingsSeleccionados.map(topping => (
                    <span key={topping} className="topping-tag">
                      {topping}
                      <button 
                        className="eliminar-topping" 
                        onClick={() => toggleTopping(topping)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="resumen-tostada">
              <h4>Resumen:</h4>
              <p>
                Tostada de {configTostada.tipoPan} {configTostada.tamanio}
                {configTostada.toppingsSeleccionados.length > 0 ? 
                  ` con ${configTostada.toppingsSeleccionados.join(", ")}` : 
                  " sin ingredientes adicionales"
                }
              </p>
            </div>

            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setMostrarModalTostada(false)}>
                Cancelar
              </button>
              <button className="btn-confirmar" onClick={confirmarTostada}>
                Añadir Tostada
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}