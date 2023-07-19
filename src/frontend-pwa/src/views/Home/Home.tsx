/**
 * @summary The main view for the application
 * @author Dallas Richmond, LocalNewsTV
 */
import { NavButton } from '../../components/appNav';
import {
  Wrapper,
  ButtonWrapper,
  ViewContainer,
} from './home.styles';
import location from '/iconography/FindOffice.svg';
import report from '/iconography/ReportColor.svg';
import services from '/iconography/FindServiceColor.svg';
import Greeting from '../../components/utility/Greeting/Greeting';
import { homeContent } from '../../content/content';
import useAppService from '../../services/app/useAppService';

export default function Home() {
  const { state } = useAppService();
  const { lang } = state.settings;
  return (
    <ViewContainer>
      <Wrapper>
        <Greeting />
        <ButtonWrapper>
          <NavButton
            path="/location"
            text={homeContent.findOffice[lang]}
            icon={location}
            hex="#C8E1F8"
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <NavButton
            path="/services"
            text={homeContent.findService[lang]}
            icon={services}
            hex="#FFD6DA"
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <NavButton
            path="/report"
            text={homeContent.report[lang]}
            icon={report}
            hex="#FDE7C6"
          />
        </ButtonWrapper>
      </Wrapper>
    </ViewContainer>
  );
}
