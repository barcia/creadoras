# NGAL

API con creadoras e creadores de contido en galego en distintas plataformas

## Funcionamento

Os scripts funcionan con [Deno](https://deno.land/). Se non o tes instalado,
[aquí estan as instruccións](https://deno.land/manual@v1.7.4/getting_started/installation).

Para crear o arquivo `dist/api.json` co que funcionará a API:

```
deno run --allow-read --allow-write --allow-net scripts/build.js
```

Para levantar un servidor local para a API http://localhost:3000

```
deno run --allow-read --allow-net scripts/server.js
```

Para levantar un servidor local cunha web en html http://localhost:3000

```
deno run --unstable -A https://deno.land/x/lume/cli.js --serve --root=web
```

## Validar os YAML en VSCode

1. Instala a extensión
   [yaml](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
2. Activa nos axustes de _vscode_ do propio proxecto a validación:

   ```json
   {
     "yaml.schemas": {
       "./scripts/schema.json": ["/data/*"]
     }
   }
   ```
