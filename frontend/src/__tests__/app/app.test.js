import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../../App';

describe('App Routing', () => {
  it('renders Login component when path is /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders HomeAdmin component when path is /homeadmin', () => {
    render(
      <MemoryRouter initialEntries={['/homeadmin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/home admin/i)).toBeInTheDocument();
  });

  it('renders Home component when path is /home', () => {
    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it('renders Signin component when path is /signin', () => {
    render(
      <MemoryRouter initialEntries={['/signin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/signin/i)).toBeInTheDocument();
  });

  it('renders RaceData component when path is /racedata/:id', () => {
    render(
      <MemoryRouter initialEntries={['/racedata/123']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/race data/i)).toBeInTheDocument();
  });

  it('renders RaceDataAdmin component when path is /racedataAdmin/:id', () => {
    render(
      <MemoryRouter initialEntries={['/racedataAdmin/123']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/race data admin/i)).toBeInTheDocument();
  });

  it('renders RunnersPage component when path is /runners/:id', () => {
    render(
      <MemoryRouter initialEntries={['/runners/123']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/runners page/i)).toBeInTheDocument();
  });

  it('renders SponsorsPage component when path is /sponsors/:id', () => {
    render(
      <MemoryRouter initialEntries={['/sponsors/123']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/sponsors page/i)).toBeInTheDocument();
  });

  it('renders UserSettings component when path is /usersettings', () => {
    render(
      <MemoryRouter initialEntries={['/usersettings']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/user settings/i)).toBeInTheDocument();
  });

  it('renders RunnersCRUD component when path is /runners', () => {
    render(
      <MemoryRouter initialEntries={['/runners']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/runners crud/i)).toBeInTheDocument();
  });

  it('renders RunnersCRUDuser component when path is /runnersuser', () => {
    render(
      <MemoryRouter initialEntries={['/runnersuser']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/runners crud user/i)).toBeInTheDocument();
  });

  it('renders SponsorsCRUD component when path is /sponsors', () => {
    render(
      <MemoryRouter initialEntries={['/sponsors']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/sponsors crud/i)).toBeInTheDocument();
  });

  it('renders UserCRUD component when path is /users', () => {
    render(
      <MemoryRouter initialEntries={['/users']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/user crud/i)).toBeInTheDocument();
  });

  it('renders Report component when path is /report', () => {
    render(
      <MemoryRouter initialEntries={['/report']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/report/i)).toBeInTheDocument();
  });
});
