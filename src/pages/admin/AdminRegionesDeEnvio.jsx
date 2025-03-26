import { getRegionsActive, createRegion } from "../../services/regionService";
import { regionesComunas } from "../../data/regiones-comunas";

const AdminRegionesDeEnvio = () => {
    return (
        <div>
            <h1>Regiones de Envío</h1>
            <p>Esta es la página de administración de regiones de envío.</p>
        </div>
    );
}

export { AdminRegionesDeEnvio };