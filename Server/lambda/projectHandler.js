// projects Lambda Function
const dynamoService = require('./services/dynamoService');
const { log, handleError } = require('./utils/logger');
const { handleDynamoError } = require('./utils/errorHandler');

exports.handler = async (event) => {
    try {
        let body;
        if (event.body) {
            body = JSON.parse(event.body);
        }

        switch (event.resource) {
            case '/listProjects':
                return await listProjects(event.queryStringParameters);
            case '/createProject':
                return await createProject(body, event.requestContext.authorizer);
            case '/updateProject':
                return await updateProject(event.pathParameters.projectId, body);
            case '/deleteProject':
                return await deleteProject(event.pathParameters.projectId);
            case '/projects-easy':
                return await getProjectsByDifficulty('easy');
            case '/projects-medium':
                return await getProjectsByDifficulty('medium');
            case '/projects-hard':
                return await getProjectsByDifficulty('hard');
        }
    } catch (error) {
        log('error', error);
        handleError(error); // Enhanced error handling
        return formatLambdaResponse(500, { error: error.message });
    }
};

async function listProjects(queryParams) {
    try {
        let response;
        if (queryParams.difficulty) {
            // Query using the DifficultyIndex if difficulty is a parameter
            response = await dynamoService.queryItemsWithIndex(
                'Projects', 'DifficultyIndex', 
                'difficulty = :difficulty', 
                { ':difficulty': queryParams.difficulty }
            );
        } else {
            // Fetch all projects if no difficulty filter is applied
            const params = {
                TableName: 'Projects',
                // Add any other parameters needed for your query
            };
            response = await dynamoDb.scan(params).promise();
        }
        return formatLambdaResponse(200, response.Items);
    } catch (error) {
        handleError(error);
        return formatLambdaResponse(500, { error: 'Failed to list projects' });
    }
}

// Creating a new project
async function createProject(body, authorizerContext) {
    try {
        const userId = authorizerContext.principalId;
        const projectItem = {
            projectId: dynamoService.uuidv4(),
            userId,
            ...body,
            createdAt: new Date().toISOString()
        };
        await dynamoService.createProject(projectItem);
        return formatLambdaResponse(201, { message: "Project created successfully", project: projectItem });
    } catch (error) {
        handleError(error);
        return formatLambdaResponse(500, { error: 'Failed to create project' });
    }
}

// Updating a project
async function updateProject(projectId, updates) {
    try {
        const response = await dynamoService.updateProject(projectId, updates);
        return formatLambdaResponse(200, { message: "Project updated successfully", updatedAttributes: response });
    } catch (error) {
        handleError(error);
        return formatLambdaResponse(500, { error: 'Failed to update project' });
    }
}

// Deleting a project
async function deleteProject(projectId) {
    try {
        await dynamoService.deleteProject(projectId);
        return formatLambdaResponse(200, { message: "Project deleted successfully" });
    } catch (error) {
        handleError(error);
        return formatLambdaResponse(500, { error: 'Failed to delete project' });
    }
}

async function getProjectsByDifficulty(difficulty) {
    try {
        // Query projects by difficulty level here
        const response = await dynamoService.queryItemsWithIndex(
            'Projects', 'DifficultyIndex', 
            'difficulty = :difficulty', 
            { ':difficulty': difficulty }
        );
        return formatLambdaResponse(200, response.Items);
    } catch (error) {
        handleError(error);
        return formatLambdaResponse(500, { error: `Failed to retrieve ${difficulty} projects` });
    }
}

function formatLambdaResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    };
}

// Include necessary utility functions like dynamoService.uuidv4 if not already present
