module MyApp
  class Job
    CHANNEL = 'chat'

    attr_reader :message, :redis

    def initialize(message)
      @message = message
      @redis   = Redis.new(Settings.redis.to_hash)
    end

    def run
      redis.publish(CHANNEL, message)
    end
  end
end
