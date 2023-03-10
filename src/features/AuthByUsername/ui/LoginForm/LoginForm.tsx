import React from 'react';

import { classNames } from 'shared/lib/ClassNames/ClassNames';
import { useTranslation } from 'react-i18next';
import { Button, ButtonVariables } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input';

import { useSelector } from 'react-redux';

import { loginActions, loginReducer } from 'features/AuthByUsername/model/slice/loginSlice';
import { loginByUsername } from 'features/AuthByUsername/model/services/loginByUsername/loginByUsername';
import { Text } from 'shared/ui/Text';
import { TextTheme } from 'shared/ui/Text/ui/Text';
import { DynamicModuleLoader, ReducersList } from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from 'shared/lib/hooks/useAppDispatch/useAppDispatch';
import { InputVariable } from 'shared/ui/Input/ui/Input';
import { getLoginUsername } from '../../model/selectors/getLoginUsername/getLoginUsername';
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword';
import { getLoginLoading } from '../../model/selectors/getLoginLoading/getLoginLoading';
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError';
import cls from './LoginForm.module.scss';

export interface LoginFormProps {
  className?: string;
  onSuccess: () => void;
}

const initialReducers: ReducersList = {
  login: loginReducer,
};

const LoginForm: React.FC<LoginFormProps> = React.memo((props) => {
  const { className, onSuccess } = props;
  const { t } = useTranslation('modal-auth');
  const dispatch = useAppDispatch();

  const username = useSelector(getLoginUsername);
  const password = useSelector(getLoginPassword);
  const isLoading = useSelector(getLoginLoading);
  const error = useSelector(getLoginError);

  const onChangeUsername = React.useCallback(
    (value: string) => {
      dispatch(loginActions.setUsername(value));
    },
    [dispatch],
  );

  const onChangePassword = React.useCallback(
    (value: string) => {
      dispatch(loginActions.setPassword(value));
    },
    [dispatch],
  );

  const onLoginClick = React.useCallback(async () => {
    const result = await dispatch(loginByUsername({ username, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      onSuccess();
    }
  }, [dispatch, username, password, onSuccess]);

  return (
    <DynamicModuleLoader removeAfterUnmount={false} reducers={initialReducers}>
      <div className={classNames(cls.LoginForm, {}, [className])}>
        <Text title={t('?????????? ??????????????????????')} theme={TextTheme.SECONDORY_INVERTED} />
        {error && <Text text={t('???? ?????????? ?????????????????? ?????????? ?????? ????????????')} theme={TextTheme.ERROR} />}
        <Input
          value={username}
          theme={InputVariable.PRIMARY_INVERTED}
          onChange={onChangeUsername}
          autoFocus
          placeholder={t('?????????????? ?????? ????????????????????????')}
          className={cls.input}
          type="text"
        />
        <Input
          value={password}
          theme={InputVariable.PRIMARY_INVERTED}
          onChange={onChangePassword}
          placeholder={t('?????????????? ????????????')}
          className={cls.input}
          type="text"
        />
        <Button disabled={isLoading} onClick={onLoginClick} theme={ButtonVariables.OUTLINE_INVERTED} className={cls.loginBtn}>
          {t('??????????')}
        </Button>
      </div>
    </DynamicModuleLoader>
  );
});

export default LoginForm;
