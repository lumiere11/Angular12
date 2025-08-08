## Project API Documentation

### Overview
This Angular 17 application is structured around feature modules (Auth, Home, Tracks, Favorites, History) and a `SharedModule` that exposes reusable UI components, a pipe, and a directive. Services provide HTTP access to a backend API configured via the `enviroment` files.

- **Angular version**: 17
- **RxJS**: ~7.8
- **HTTP base URL**: `enviroment.api` in `src/enviroments/enviroment*.ts`

### Getting Started
- Install dependencies and start:
```bash
npm install
npm start
```
- Navigate to the app at `http://localhost:4200/`.

### Path Aliases
Configured in `tsconfig.json`:
- `@core/*` → `src/app/core/*`
- `@modules/*` → `src/app/modules/*`
- `@shared/*` → `src/app/shared/*`

---

## Models (Interfaces)

### `TrackModel` (`src/app/core/models/tracks.model.ts`)
Represents a music track.
```ts
export interface TrackModel {
  name: string;
  album: string;
  cover: string;
  url: string;
  _id: string;
  artist?: ArtistModel;
}
```

### `ArtistModel` (`src/app/core/models/artist.model.ts`)
```ts
export interface ArtistModel {
  name: string;
  nickname: string;
  nationality: string;
}
```

### `ApiTrackModel` (`src/app/core/models/api-track.model.ts`)
```ts
export interface ApiTrackModel {
  data: TrackModel[];
}
```

### `ApiResponse<T>` (`src/app/core/models/api-response.ts`)
```ts
export interface ApiResponse<T> {
  data: T;
}
```

### `SessionModel` (`src/app/core/models/session.model.ts`)
```ts
export interface SessionModel {
  data: UserData;
  tokenSession: string;
}

export interface UserData {
  name: string;
  email: string;
  password: string;
  avatar: string;
}
```

---

## Environment Configuration

### `enviroment.ts` (`src/enviroments/enviroment.ts`)
```ts
export const enviroment = {
  production: false,
  api: 'http://localhost:3000/api/1.0'
};
```

### `enviroment.prod.ts` (`src/enviroments/enviroment.prod.ts`)
```ts
export const enviroment = {
  production: false,
  api: 'http://localhost:3001/api/1.0'
};
```

Use `enviroment.api` as the base URL for HTTP services.

---

## Services

### `AuthService` (`src/app/modules/auth/services/auth.service.ts`)
Provides authentication.

Public API:
- `sendCredentials(email: string, password: string): Observable<any>`
  - POSTs to `${enviroment.api}/auth/login` with `{ email, password }`.
  - Returns an observable of `SessionModel` (as typed in the request).

Example usage:
```ts
import { Component } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({ selector: 'example-auth', template: `...` })
export class ExampleAuthComponent {
  constructor(private authService: AuthService) {}

  login(email: string, password: string): void {
    this.authService.sendCredentials(email, password).subscribe({
      next: (session) => console.log('Logged in', session),
      error: (err) => console.error('Login failed', err)
    });
  }
}
```

### `TrackService` (`src/app/modules/tracks/services/track.service.ts`)
Fetches tracks.

Public API:
- `dataTracksTrending$: Observable<TrackModel[]>` – exposed stream (initialized to `of([])`).
- `dataTracksRandom$: Observable<TrackModel[]>` – exposed stream (initialized to `of([])`).
- `getAllTracks$(): Observable<TrackModel[]>` – GET `${api}/tracks` and map to `data`.
- `getAllRandom$(): Observable<TrackModel[]>` – GET `${api}/tracks`, reverse order.

Example usage:
```ts
import { Component, OnInit } from '@angular/core';
import { TrackService } from '@modules/tracks/services/track.service';
import { TrackModel } from '@core/models/tracks.model';

@Component({ selector: 'example-tracks', template: `...` })
export class ExampleTracksComponent implements OnInit {
  tracks: TrackModel[] = [];
  constructor(private trackService: TrackService) {}

  ngOnInit(): void {
    this.trackService.getAllTracks$().subscribe({
      next: (data) => (this.tracks = data),
      error: (err) => console.error(err)
    });
  }
}
```

### `MultiMediaService` (`src/app/shared/services/multi-media.service.ts`)
Simple event bus for multimedia actions.

Public API:
- `callback: EventEmitter<any>` – emit and subscribe to multimedia events (e.g., play track).

Example usage:
```ts
// Producer
constructor(private multimediaService: MultiMediaService) {}
play(track: TrackModel): void {
  this.multimediaService.callback.emit(track);
}

// Consumer
subscription = this.multimediaService.callback.subscribe((track: TrackModel) => {
  // Handle track playback
});
```

---

## Pipe

### `OrderListPipe` (`src/app/shared/pipes/order-list.pipe.ts`)
Sorts an array by a property and order.

Signature:
- `transform(value: any[], args: string | null = null, sort: 'asc' | 'desc' = 'asc'): TrackModel[]`

Behavior:
- If `args` is `null`, returns value unchanged.
- Otherwise sorts by property name `args`. Reverses when `sort` is `'desc'`.
- Catches errors and returns original `value`.

Template usage:
```html
<!-- Sort by name ascending -->
<div *ngFor="let track of tracks | orderList: 'name' : 'asc'">
  {{ track.name }} - {{ track.album }}
</div>

<!-- Dynamic sort with component state -->
<div *ngFor="let track of tracks | orderList: optionSort.prop : optionSort.order"></div>
```

---

## Directive

### `ImgBrokenDirective` (`src/app/shared/directives/img-broken.directive.ts`)
Replaces broken `<img>` sources with a custom fallback.

Selector:
- `img[appImgBroken]`

Inputs:
- `customImg: string` – URL/path for fallback image.

Behavior:
- On `error` event, sets `elNative.src = customImg`.

Template usage:
```html
<img [src]="track.cover" appImgBroken [customImg]="'/assets/placeholder.png'" alt="cover" />
```

---

## Shared UI Components
All declared and exported by `SharedModule` (`src/app/shared/shared.module.ts`). Import `SharedModule` into any feature module to use these components, the pipe, and the directive.

### `SideBarComponent`
- Selector: `app-side-bar`
- Purpose: Navigation menu with default options, access links, and custom lists.

Usage:
```html
<app-side-bar></app-side-bar>
```

### `HeaderUserComponent`
- Selector: `app-header-user`

Usage:
```html
<app-header-user></app-header-user>
```

### `MediaPlayerComponent`
- Selector: `app-media-player`
- Subscribes to `MultiMediaService.callback` for playback events.

Usage:
```html
<app-media-player></app-media-player>
```

### `CardPlayerComponent`
- Selector: `app-card-player`
- Inputs:
  - `mode: 'small' | 'big'` (default `'small'`)
  - `track: TrackModel`
- Emits: uses `MultiMediaService.callback` to emit play events via `sendPlay(track)`.

Usage:
```html
<app-card-player [mode]="'big'" [track]="track"></app-card-player>
```

### `SectionGenericComponent`
- Selector: `app-section-generic`
- Inputs:
  - `title: string`
  - `mode: 'small' | 'big'` (default `'big'`)
  - `dataTracks: TrackModel[]`

Usage:
```html
<app-section-generic
  title="Trending"
  [mode]="'big'"
  [dataTracks]="tracks">
</app-section-generic>
```

### `PlayListHeaderComponent`
- Selector: `app-play-list-header`

Usage:
```html
<app-play-list-header></app-play-list-header>
```

### `PlayListBodyComponent`
- Selector: `app-play-list-body`
- Internal state: `tracks: TrackModel[]`, `optionSort: { prop: string | null; order: 'asc' | 'desc' }`
- Method: `changeSort(prop: string)` toggles sort order.

Usage:
```html
<app-play-list-body></app-play-list-body>
```

---

## Pages (Feature Components)

### `HomePageComponent`
- Selector: `app-home-page`
- Declared in `HomeModule`.

### `TrackPageComponent`
- Selector: `app-track-page`
- Declared in `TracksModule`.
- Fetches and exposes `tracksTrending` and `tracksRandom` via `TrackService`.

### `FavoritePageComponent`
- Selector: `app-favorite-page`
- Declared in `FavoritesModule`.

### `HistoryPageComponent`
- Selector: `app-history-page`
- Declared in `HistoryModule`.

### `AuthPageComponent` and `LoginPageComponent`
- Selectors: `app-auth-page`, `app-login-page`
- Declared in `AuthModule`.
- `LoginPageComponent` builds a reactive form and calls `AuthService.sendCredentials`.

Example login template snippet:
```html
<form [formGroup]="formLogin" (ngSubmit)="sendLogin()">
  <input formControlName="email" type="email" />
  <input formControlName="password" type="password" />
  <button type="submit">Login</button>
  <div *ngIf="errorSession">Invalid credentials</div>
</form>
```

---

## Modules and Routing

### `SharedModule` (`src/app/shared/shared.module.ts`)
Exports reusable components, pipe, and directive. Import into feature modules to use shared UI.

```ts
@NgModule({
  declarations: [/* shared components, pipe, directive */],
  imports: [CommonModule, RouterModule],
  exports: [/* same list to re-use elsewhere */]
})
export class SharedModule {}
```

### Root Configuration (`src/app/app.config.ts`)
```ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()]
};
```

### Root Routes (`src/app/app.routes.ts`)
- `path: 'auth'` → lazy loads `AuthModule`
- `path: ''` → component `HomePageComponent` and lazy loads `HomeModule`

### `HomeRoutingModule`
Defines feature routes under root:
- `/tracks` → lazy loads `TracksModule`
- `/history` → lazy loads `HistoryModule`
- `/favorites` → lazy loads `FavoritesModule`
- `**` → redirects to `/tracks`

### `TracksRoutingModule`
- `path: ''` → `TrackPageComponent` (uses named outlet `child`)

### `FavoritesRoutingModule`
- `path: ''` → `FavoritePageComponent` (uses named outlet `child`)

### `AuthRoutingModule`
- `path: 'login'` → `LoginPageComponent`
- `**` → redirects to `/login`

---

## Usage Notes and Patterns

- **Importing shared UI**: Add `SharedModule` to your feature module `imports` to use shared components, pipe, and directive.
- **HTTP calls**: All HTTP calls use Angular `HttpClient`. Ensure `provideHttpClient()` is included (already configured in `app.config.ts`).
- **Observables**: Subscribe in components and unsubscribe in `ngOnDestroy` when you create your own subscriptions. Many Angular primitives (like `async` pipe) can manage subscriptions automatically.
- **Template sorting**: Combine `OrderListPipe` with a local sort state to enable click-to-sort tables/lists.
- **Fallback images**: Use `ImgBrokenDirective` to gracefully handle broken image URLs.

---

## Examples

### Display a track list with sorting and card player
```html
<!-- tracks.component.html -->
<app-section-generic title="Trending" [mode]="'big'" [dataTracks]="tracks"></app-section-generic>

<table>
  <thead>
    <tr>
      <th (click)="changeSort('name')">Name</th>
      <th (click)="changeSort('album')">Album</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let t of tracks | orderList: optionSort.prop : optionSort.order">
      <td>
        <app-card-player [mode]="'small'" [track]="t"></app-card-player>
      </td>
      <td>{{ t.album }}</td>
    </tr>
  </tbody>
</table>
```

### Emitting and handling play events
```ts
// In a child card component or list item
this.multimediaService.callback.emit(track);

// In a media player component (already wired)
this.subscription = this.multimediaService.callback.subscribe((track: TrackModel) => {
  // Start playback or update UI
});
```

### Login with reactive form
```ts
sendLogin(): void {
  const { email, password } = this.formLogin.value;
  this.authService.sendCredentials(email, password).subscribe({
    next: () => console.log('Session started'),
    error: () => (this.errorSession = true)
  });
}
```

---

## Contributing New Features
- Create a feature module under `src/app/modules/<feature>`
- Declare components and provide routes via a `<feature>-routing.module.ts`
- Import `SharedModule` for shared UI capabilities
- Add a lazy route under `HomeRoutingModule` or `app.routes.ts` as appropriate