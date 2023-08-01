import InvalidInput from './invalid-input';

class EmptyInput extends InvalidInput {
  constructor() {
    super('data is not defined', 'data_not_defined');
  }
}

export default EmptyInput;
