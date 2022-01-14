import * as React from "react";
import { Image } from "react-native";
import { Banner } from "react-native-paper";
import { connect } from "react-redux";

function mapStateToProps(state) {
  return {
    action: state.action,
    isBannerActive: state.isBannerActive,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setBannerStatus: (banner_status) =>
      dispatch({
        type: "UPDATE_BANNER_STATUS",
        banner_status,
      }),
  };
}

class BannerComponent extends React.Component {
  state = {
    isVisible: false,
  };

  check = async (navigation) => {
    this.props.setBannerStatus(!this.props.isBannerActive);
  };

  render() {
    return (
      <Banner
        style={{
          backgroundColor: "#d9d9db",
          alignItems: "center",
          borderBottomEndRadius: 10,
          borderBottomStartRadius: 10,
          zIndex: 1,
        }}
        visible={this.props.isBannerActive}
        actions={[
          {
            label: "Ok",
            onPress: () => this.check(),
          },
        ]}
      >
        Admin has assigned an order, Check active orders !
      </Banner>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerComponent);
