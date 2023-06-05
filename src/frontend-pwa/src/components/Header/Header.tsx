/**
 * @summary Reusable BC Gov Header Component
 * @author Dallas Richmond
 */
import logo from '/logo-banner.svg';
import gear from '/gear-icon.svg';
import NavBackButton from '../NavBackButton/NavBackButton';
import {
  Link,
} from 'react-router-dom';

import {
  HeaderWrapper,
  Heading,
  Banner,
  Image,
  StyledSettingsButton,
  StyledIcon,
} from './header.styles';

export default function Header() {
  return (
    <HeaderWrapper>
      <Banner>
        <Image>
          <img src={logo} alt="Go to the Government of British Columbia website" />
        </Image>
        <Heading>Wayfinder</Heading>
      </Banner>
      <Link to="/settings">
        <StyledSettingsButton
          type="button"
          aria-label="Settings button"
        >
          <StyledIcon src={gear} alt="Settings" />
        </StyledSettingsButton>
        <NavBackButton />
      </Link>
    </HeaderWrapper>
  );
}
