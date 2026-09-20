export interface Skill {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'development' | 'advanced';
  content: string;
  filePath: string;
}

export interface PlatformPlugin {
  id: string;
  name: string;
  description: string;
  manifestFile: string;
  instructions: string;
  status: 'active' | 'inactive';
  configSnippet: string;
}

export interface CompanionScreen {
  id: string;
  title: string;
  htmlContent: string;
  timestamp: string;
}

export interface WorkspaceCheck {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  message: string;
}
