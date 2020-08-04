/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end
 * POST: Criar uma informação no back-end
 * PUT/PATCH: Alterar uma informação no back-end
 * DELETE: Deletar uma informação no back-end
*/

/**
 * Tipos de parâmetros:
 * 
 * Query Params: Filtros e paginação
 * Route Params: Identificar recursos (Atualizar/Deletar)
 * Request Body: Conteúdo na hora de criar ou editar recurso (JSON)
*/

/**
 * Middleware:
 * 
 * Interceptador de requisições
 * Pode interromper ou alterar dados da requisição
*/

const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();
app.use(cors());
app.use(express.json());

function logRequests(request, response, next) {
    const { method, url } = request;
    const loglabel = `[${method.toUpperCase()}] ${url}`;
    
    console.log(loglabel);

    console.log('Etapa 1 - Antes do Next');
    next();
    console.log('Etapa 3 - Depois do Next');
}

function validateProjectId(request, response, next) {
    const { id } = request.params;
    
    if(!isUuid(id)) {
        return response.status(400).json({ error: 'Project not found' });
    }

    return next();
}

app.use('/projects/:id', validateProjectId);

const projects = [];

app.get('/projects', logRequests, (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

        console.log('Etapa 2 - Dentro do List');
    return response.json(results);
});

app.post('/projects', (request, response) => {
    const { title, owner } = request.body;
    const project = { id: uuid(), title, owner };
    projects.push(project);

    return response.json(project);
});

app.put('/projects/:id', (request, response) => {
    const { id } = request.params;
    const { title, owner } = request.body;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' });
    }

    const project = {
        id,
        title,
        owner,
    };

    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
    const { id } = request.params;

    const projectIndex = projects.findIndex(project => project.id == id);

    if (projectIndex < 0) {
        return response.status(400).json({ error: 'Project not found' });
    }

    projects.splice(projectIndex, 1);

    return response.status(204).send();
});


app.listen(3333, () => {
    console.log('Back-end Started!')
});