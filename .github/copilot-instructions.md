# GitHub Copilot Instructions for IFNOT Repository

## Repository Overview

This repository contains the IFNOT fund project, integrated with Charlie Labs AI (a Texas-based AI innovation company). The main application is a Python-based "Fragle Heist Simulator" - a fun, randomized simulation of heist scenarios.

**Website:** [www.charlielabs.ai](https://www.charlielabs.ai)

## Project Structure

- `fragle_heist_simulator.py` - Main Python application that simulates heist scenarios
- `README.md` - Project documentation and Charlie Labs AI integration details
- `requirements.txt` - Documentation of Node.js dependencies (note: this is for reference; actual installs use npm)
- `.github/` - GitHub configuration files

## Code Style and Standards

### Python Code
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Include docstrings for functions and modules
- Keep functions focused and single-purpose
- Use type hints where appropriate

### General Practices
- Write clear, self-documenting code
- Add comments only when necessary to explain complex logic
- Use consistent naming conventions
- Maintain the playful, creative tone of the existing code (especially in the heist simulator)

## Main Application: Fragle Heist Simulator

The `fragle_heist_simulator.py` script is a humorous simulation that:
- Assembles a random crew from a list of quirky characters
- Selects a random target location
- Encounters random obstacles
- Produces random heist outcomes

When modifying this file:
- Preserve the creative, humorous nature of the content
- Maintain the emoji usage for visual appeal
- Keep the simulation flow intact (crew assembly → target → obstacle → outcome)
- Ensure timing delays create an engaging user experience

## Dependencies and Tools

### Node.js Dependencies (referenced in requirements.txt)
- `canvas` - Canvas graphics library
- `tone` - Audio synthesis library
- `plop` - Code generation tool
- `nodemon` - Development auto-restart tool
- `eslint` - JavaScript linting
- `prettier` - Code formatting

### Python Dependencies
- Standard library only (random, time)
- No external Python packages required for the main simulator

## Testing Approach

- Currently, the project does not have a formal test suite
- When adding tests, consider:
  - Testing the heist simulator logic
  - Ensuring random selections work correctly
  - Verifying output format and content
  - Use pytest for Python testing if adding test infrastructure

## Building and Running

### Python Application
```bash
python3 fragle_heist_simulator.py
```

No build process required - the simulator runs directly.

## Special Considerations

1. **Creative Content**: The heist simulator contains playful, creative content. Maintain this tone when making modifications.

2. **Charlie Labs AI Integration**: This repository is part of the Charlie Labs AI ecosystem. Be mindful of this integration when making significant architectural changes.

3. **Minimal Dependencies**: The project intentionally has minimal dependencies. Avoid adding unnecessary external packages unless there's a clear need.

4. **File Purpose**: 
   - `console.log` appears to be a placeholder file
   - `requirements.txt` documents Node.js dependencies but actual installation uses npm/package.json

## Common Tasks

### Adding New Heist Elements
When adding crew members, locations, obstacles, or outcomes:
- Add to the respective list at the top of `fragle_heist_simulator.py`
- Maintain the creative, humorous style
- Keep list items concise and entertaining

### Documentation Updates
- Update README.md for user-facing changes
- Update this file for developer-facing changes
- Keep documentation clear and concise

## Questions or Issues?

For questions about the IFNOT fund or Charlie Labs AI integration, refer to:
- Charlie Labs AI website: www.charlielabs.ai
- Repository README.md for integration details
