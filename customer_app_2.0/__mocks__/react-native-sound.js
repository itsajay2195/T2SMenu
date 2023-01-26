// https://github.com/zmxv/react-native-sound/issues/245
const Sound = () => {
    class SoundMock {
        constructor(path, type, callback) {}
    }

    SoundMock.prototype.setVolume = jest.fn();
    SoundMock.prototype.setNumberOfLoops = jest.fn();
    SoundMock.prototype.play = jest.fn();
    SoundMock.prototype.stop = jest.fn();

    return SoundMock;
};

Sound.setCategory = jest.fn();

export default Sound;
