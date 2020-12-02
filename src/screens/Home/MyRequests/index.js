import React from 'react';
import { Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';



const MyRequests = props => {


    renderItem = ({ item, index, separators }) => {

        const { selectedButton, buyAdRequestsList } = this.state;
        const { isUserAllowedToSendMessageLoading } = this.props;


        return (
            <BuyAdList
                item={item}
                openChat={this.openChat}
                selectedButton={selectedButton}
                isUserAllowedToSendMessageLoading={isUserAllowedToSendMessageLoading}
                index={index}
                buyAdRequestsList={buyAdRequestsList}
                separators={separators}
            />
        )
    }

    return (
        <>
            <View style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                height: 45,
                elevation: 5,
                justifyContent: 'center'
            }}>
                <TouchableOpacity
                    style={{ width: 40, justifyContent: 'center', position: 'absolute', right: 0 }}
                    onPress={() => this.props.navigation.goBack()}
                >
                    <AntDesign name='arrowright' size={25} />
                </TouchableOpacity>

                <View style={{
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <Text
                        style={{ fontSize: 18, fontFamily: 'IRANSansWeb(FaNum)_Bold' }}
                    >
                        {locales('titles.editProfile')}
                    </Text>
                </View>
            </View>
            <SafeAreaView
                // style={{ padding: 10, height: userInfo.active_pakage_type == 0 ? (deviceHeight * 0.783) : userInfo.active_pakage_type !== 3 ? (deviceHeight * 0.82) : (deviceHeight * 0.8) }}
                style={{ height: '100%', paddingBottom: 60 }}
            >

                <FlatList
                    // ref={this.props.requestsRef}
                    refreshing={false}
                    // onRefresh={() => {
                    //     this.props.fetchAllBuyAdRequests();
                    // }}
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='handled'
                    ListEmptyComponent={() => !!buyAdRequestLoading ?
                        [1, 2, 3, 4, 5].map((_, index) =>
                            <View
                                key={index}
                                style={{
                                    backgroundColor: '#fff',
                                    paddingTop: 25,
                                    paddingBottom: 10,
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#ddd'
                                }}>
                                <ContentLoader
                                    speed={2}
                                    width={deviceWidth}
                                    height={deviceHeight * 0.24}
                                    viewBox="0 0 340 160"
                                    backgroundColor="#f3f3f3"
                                    foregroundColor="#ecebeb"
                                >
                                    <Rect x="50" y="37" rx="3" ry="3" width="242" height="20" />
                                    <Rect x="85" y="3" rx="3" ry="3" width="169" height="20" />
                                    <Rect x="22" y="119" rx="3" ry="3" width="299" height="30" />
                                    <Rect x="116" y="74" rx="3" ry="3" width="105" height="20" />
                                </ContentLoader>
                            </View>)
                        : <View style={{
                            alignSelf: 'center', justifyContent: 'center',
                            alignContent: 'center', alignItems: 'center', width: deviceWidth * 0.9, height: deviceHeight * 0.7
                        }}>
                            <Entypo name='list' size={80} color='#BEBEBE' />
                            <Text style={{ textAlign: 'center', color: '#7E7E7E', fontFamily: 'IRANSansWeb(FaNum)_Bold', fontSize: 17, padding: 15, textAlign: 'center' }}>{locales('titles.noBuyAdFound')}</Text>
                        </View>
                    }
                    // data={buyAdRequestsList}
                    // extraData={this.state}
                    onEndReachedThreshold={0.2}
                    // keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem()}
                    windowSize={10}
                    initialNumToRender={3}
                    maxToRenderPerBatch={3}
                    style={{
                        // paddingHorizontal: 15,
                        marginBottom: selectedFilterName ? 92 : 45
                    }} />

                <View style={{
                    position: 'absolute',
                    zIndex: 1,
                    bottom: selectedFilterName ? 92 : 45,
                    width: '100%',
                    righ: 0,
                    left: 0,
                    backgroundColor: '#fff',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    padding: 7,
                    elevation: 5
                }}>
                    <Button
                        style={{
                            flex: 3,
                            justifyContent: 'center',
                            backgroundColor: '#556080',
                            borderRadius: 4
                        }}
                        onPress={() => this.setState({ showFilters: true })}>
                        <Text style={{
                            textAlign: 'center',
                            color: '#fff',
                            flexDirection: 'row',
                            fontFamily: 'IRANSansWeb(FaNum)_Medium'
                        }}>
                            {locales('titles.categories')}
                        </Text>
                        <FontAwesome5 name="filter" solid color="#fff" style={{
                            marginHorizontal: 5
                        }} />

                    </Button>

                </View>


            </SafeAreaView>
        </>
    )
}
export default MyRequests