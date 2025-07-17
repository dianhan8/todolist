# TaskManagement

# Project Structure

```
task-management/
├── src/
│   ├── app/
│   │   ├── core/                # Shared services, models, constants
│   │   │   ├── base/
│   │   │   ├── constants/
│   │   │   ├── dtos/
│   │   │   ├── models/
│   │   │   ├── services/
│   │   │   └── usecases/
│   │   ├── features/            # Feature components
│   │   │   ├── add-task/
│   │   │   ├── view-kanban/
│   │   │   └── view-tables/
│   │   └── app.* files          # App configuration
│   ├── index.html
│   ├── main.ts
│   └── styles.less
├── public/
├── angular.json
├── package.json
└── README.md
```

# Dependencies

This project uses the following key dependencies (excluding Angular packages):

## Production Dependencies
- **[ng-zorro-antd](https://ng.ant.design/)** - Ant Design components for Angular
- **[ngx-drag-drop](https://www.npmjs.com/package/ngx-drag-drop)** - Drag and drop functionality
- **[chroma-js](https://gka.github.io/chroma.js/)** - Color manipulation library
- **[nanoid](https://github.com/ai/nanoid)** - Unique ID generator
- **[less](https://lesscss.org/)** - CSS preprocessor

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
