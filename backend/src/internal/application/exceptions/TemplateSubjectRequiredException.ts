export class TemplateSubjectRequiredException extends Error {
  constructor(message = 'Template subject is required.') {
    super(message);
    this.name = TemplateSubjectRequiredException.name;
  }
}
