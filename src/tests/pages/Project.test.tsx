import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import Project from '../../pages/Project';

describe('Project Page', () => {
  it('renders project sections', () => {
    render(<Project />);
    expect(screen.getByRole('heading', { name: 'project.title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'project.description' })).toBeInTheDocument();
    expect(screen.getByText('project.objectives')).toBeInTheDocument();
  });
});
