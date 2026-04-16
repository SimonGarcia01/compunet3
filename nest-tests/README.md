## Tarea en clase - Pruebas

Cada estudiante debe implementar pruebas unitarias y pruebas E2E siguiendo los criterios de abajo.

### 1) Pruebas unitarias de servicios (Jest)

- Deben usar `Jest` con `Test.createTestingModule`.
- Deben mockear los repositorios con `getRepositoryToken(...)` y `useValue`.
- Deben incluir, como minimo, una prueba positiva por cada metodo de los servicios de:
    - `user`
    - `role`
    - `permission`
    - `role-permission`
- Como referencia, sigan el mismo enfoque aplicado en `user` para los metodos `findAll` y `create`.

### 2) Cobertura

- Se recomienda ejecutar cobertura para identificar metodos sin pruebas, pero no se exige un porcentaje minimo obligatorio.
- Pueden validar con:

```bash
npm run test:cov
```

### 3) Pruebas E2E (Supertest)

- Deben usar `Supertest` contra la aplicacion real (`AppModule`) con autenticacion JWT.
- Solo se requiere una prueba E2E positiva para cada uno de estos metodos:
    - `create`
    - `findAll`

### 4) Pruebas automaticas usando `GitHub Actions`

En este punto, cada estudiante debe configurar un pipeline de integracion continua para ejecutar **solo pruebas unitarias** en GitHub.

#### Objetivo del pipeline

- Validar que el proyecto compila correctamente.
- Ejecutar pruebas unitarias automaticamente en cada cambio.

#### Que debe entregar el estudiante

- Un workflow en `.github/workflows/tests.yml` (o nombre equivalente).
- Evidencia de al menos una ejecucion exitosa en la pestana **Actions** del repositorio.
- El pipeline debe dispararse en:
    - `push` a `main` (o rama principal del curso).
    - `pull_request` hacia `main`.

#### Como funciona el pipeline (version simplificada)

1. **Trigger**
    - GitHub detecta un `push` o `pull_request` y lanza el workflow.
2. **Setup**
    - Se levanta una maquina virtual Ubuntu.
    - Se instala Node.js (version 20 recomendada).
3. **Instalacion y build**
    - Se ejecuta `npm ci` para instalar dependencias.
    - Se ejecuta `npm run build` para validar compilacion.
4. **Pruebas unitarias**
    - Se ejecuta `npm test`.
5. **Resultado final**
    - Si algun paso falla, el pipeline queda en rojo.
    - Si todo pasa, el pipeline queda en verde.

#### Ejemplo de workflow (referencia)

```yaml
name: CI Tests

on:
    push:
        branches: ['main']
    pull_request:
        branches: ['main']

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Node
              uses: actions/setup-node@v4
              with:
                  node-version: 20
                  cache: npm

            - name: Install dependencies
              run: npm ci

            - name: Build
              run: npm run build

                        - name: Unit tests
                            run: npm test
```

#### Criterios de evaluacion de este punto

- El workflow existe y corre en GitHub Actions.
- Ejecuta exitosamente `build` y `test`.
