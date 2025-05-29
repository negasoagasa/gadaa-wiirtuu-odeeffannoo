import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Configure test-id attribute
configure({ testIdAttribute: 'data-test' });