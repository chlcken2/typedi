import { ContainerInstance } from '../containerInstance';
import { Constructable } from '../types/constructable';

/**
 * 서비스 클래스 초기화 과정에서 실행되는 별 핸들러
 * 핸들러로 커스텀 데코레이터 생성 가능
 * INject()로 내부에서 적용될 핸들러의 구현부
 *
 */
export interface Handler<T = unknown> {
  // 핸들러가 적용될서비스 객체
  object: Constructable<T>;
  // 클래스 속성에적용될 떄 사용되는 속성 이름
  propertyName?: string;
  //생성자 파라미터에적용될 떄 사용되는 인덱스
  index?: number;
  // 속성이나 파라미터에주입될 값을 생성하는 팩토리 함수
  value: (container: ContainerInstance) => any;
}
