// src/api/templatesApi.js
import axios from "axios";

// baddel 127.0.0.1 ila katst3mel localhost f artisan serve
const API_URL = "http://127.0.0.1:8000/api";

export function fetchTemplates() {
  return axios.get(`${API_URL}/templates`).then((res) => res.data);
}

export function createTemplate(template) {
  return axios.post(`${API_URL}/templates`, template).then((res) => res.data);
}

export function deleteTemplateApi(id) {
  return axios.delete(`${API_URL}/templates/${id}`);
}
