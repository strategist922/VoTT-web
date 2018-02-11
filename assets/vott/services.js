angular.module('vott.factories', [])
    .factory('ProjectService', function ($http) {
        const baseUrl = '/api/vott/v1';
        return {
            getProjects: function (skip, limit) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/projects`
                });
            },
            getProject: function (projectId) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/projects/${projectId}`
                });
            },
            createProject: function (project) {
                if (typeof (project.labels) == 'string') {
                    project.labels = project.labels.split(',').map(v => v.trim());
                }
                return $http({
                    method: 'POST',
                    url: `${baseUrl}/projects`,
                    data: project
                });
            },
            updateProject: function (project) {
                if (typeof (project.labels) == 'string') {
                    project.labels = project.labels.split(',').map(v => v.trim());
                }
                return $http({
                    method: 'PUT',
                    url: `${baseUrl}/projects/${project.id}`,
                    data: project
                });
            },
            deleteProject: function (projectId) {
                return $http({
                    method: 'DELETE',
                    url: `${baseUrl}/projects/${projectId}`
                });
            },
            //  createInstructionsImage(projectId: String!): Image
            createInstructionsImage: function (projectId) {
                return $http({
                    method: 'POST',
                    url: `${baseUrl}/projects/${projectId}/instructionsImage`
                });
            },
            commitInstructionsImage: function (projectId, image) {
                return $http({
                    method: 'PUT',
                    url: `${baseUrl}/projects/${projectId}/instructionsImage`,
                    data: image
                });
            },
            trainingImages: function (projectId, skip, limit) {
                const query = [];
                if (skip) {
                    query.push(`skip=${skip}`);
                }
                if (limit) {
                    query.push(`limit=${limit}`);
                }
                var url = `${baseUrl}/trainingImages?projectId=${projectId}`
                if (query.length) {
                    url += '&' + query.join('&');
                }
                return $http({
                    method: 'GET',
                    url: url
                });
            },
            trainingImageStats: function (projectId) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/trainingImages/stats?projectId=${projectId}`
                });
            },
            createTrainingImage: function (projectId) {
                console.log("Creating training image with:");
                console.log(projectId);
                return $http({
                    method: 'POST',
                    url: `${baseUrl}/trainingImages`,
                    data: { projectId: projectId }
                });
            },
            commitTrainingImage: function (image) {
                return $http({
                    method: 'PUT',
                    url: `${baseUrl}/trainingImages/${image.id}`,
                    data: image
                });
            },
            createCollaborator: function (projectId, name, email, profile) {
                return $http({
                    method: 'POST',
                    url: `${baseUrl}/accessRights`,
                    data: {
                        projectId: projectId,
                        name: name,
                        email: email,
                        role: profile
                    }
                });
            },
            collaborators: function (projectId) {
                return $http({
                    method: 'GET',
                    url: `${baseUrl}/accessRights?projectId=${projectId}`
                });
            },
            deleteCollaborator: function (projectId, collaboratorId) {
                console.log("deleteCollaborator:");
                console.log(projectId);
                console.log(collaboratorId);
                return $http({
                    method: 'DELETE',
                    url: `${baseUrl}/accessRights/${collaboratorId}?projectId=${projectId}`
                });
            },
            models: function (projectId, paginationToken) {
                const invocation = paginationToken ?
                    `models(projectId: ${JSON.stringify(projectId)}, paginationToken:${JSON.stringify(paginationToken)})` :
                    `models(projectId: ${JSON.stringify(projectId)})`;
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    data: { query: "query { " + invocation + "{ nextPageToken entries { modelId created status modelURL } } }" }
                });
            },
            createModel: function (projectId) {
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    data: { query: `mutation { createModel (projectId:${JSON.stringify(projectId)}) { projectId modelId status } }` }
                });
            },
            deleteModel: function (projectId, modelId) {
                return $http({
                    method: 'POST',
                    url: baseUrl,
                    data: { query: `mutation { deleteModel (projectId:${JSON.stringify(projectId)}, modelId: ${JSON.stringify(modelId)}) }` }
                });
            },
            uploadImageToAzureStorageBlob: function (contentType, data, url, successCallback, errorCallback, progressCallback) {
                $.ajax({
                    url: url,
                    type: "PUT",
                    data: data,
                    processData: false,
                    xhr: function () {
                        var request = new XMLHttpRequest();
                        request.upload.addEventListener("progress", progressCallback, false);
                        // request.addEventListener("progress", uploadProgress);
                        return request;
                    },
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader('x-ms-blob-type', 'BlockBlob');
                        xhr.setRequestHeader('x-ms-blob-content-type', contentType);
                    },
                    success: successCallback,
                    error: errorCallback
                });
            }
        };
    });
