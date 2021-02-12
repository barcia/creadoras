# NGAL
API con creadoras e creadores de contido en galego en distintas plataformas


### Tasks:
* `npm run build`: Crea o JSON que funcionará como API
* `npm start`: Executa un *build* e despois levanta un servidor coa API.

### Validar os YAML en VSCode
1. Instala a extensión [yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
2. Activa nos axustes de *vscode* do propio proxecto a validación:
    ```json
    {
        "yaml.schemas": {
            "./data/schema.json": ["/data/*"]
        }
    }
    ```
