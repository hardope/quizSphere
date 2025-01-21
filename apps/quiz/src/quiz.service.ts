import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class QuizService {
	echo () {
		Logger.log('Echoing...', 'QuizService');
		return 'Echo!';
	}
}
