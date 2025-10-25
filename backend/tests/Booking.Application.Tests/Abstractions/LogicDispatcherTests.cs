using Booking.Application.Abstractions;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Booking.Application.Tests.Abstractions;

/// <summary>
/// Unit tests for the LogicDispatcher implementation.
/// </summary>
public class LogicDispatcherTests
{
    [Fact]
    public async Task SendAsync_WithQuery_CallsCorrectQueryHandler()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        var queryHandler = new Mock<IQueryHandler<TestQuery, string>>();
        var expectedResult = "Test Result";

        queryHandler
            .Setup(h => h.HandleAsync(It.IsAny<TestQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResult);

        serviceProvider
            .Setup(sp => sp.GetService(typeof(IQueryHandler<TestQuery, string>)))
            .Returns(queryHandler.Object);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var query = new TestQuery();

        // Act
        var result = await dispatcher.SendAsync(query);

        // Assert
        result.Should().Be(expectedResult);
        queryHandler.Verify(h => h.HandleAsync(query, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SendAsync_WithQuery_PassesCancellationToken()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        var queryHandler = new Mock<IQueryHandler<TestQuery, string>>();
        var cancellationTokenSource = new CancellationTokenSource();
        var cancellationToken = cancellationTokenSource.Token;

        queryHandler
            .Setup(h => h.HandleAsync(It.IsAny<TestQuery>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("Result");

        serviceProvider
            .Setup(sp => sp.GetService(typeof(IQueryHandler<TestQuery, string>)))
            .Returns(queryHandler.Object);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var query = new TestQuery();

        // Act
        await dispatcher.SendAsync(query, cancellationToken);

        // Assert
        queryHandler.Verify(h => h.HandleAsync(query, cancellationToken), Times.Once);
    }

    [Fact]
    public async Task SendAsync_WithQueryAndNoHandlerRegistered_ThrowsInvalidOperationException()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider
            .Setup(sp => sp.GetService(It.IsAny<Type>()))
            .Returns(null);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var query = new TestQuery();

        // Act
        Func<Task> act = async () => await dispatcher.SendAsync(query);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("No handler registered for query type TestQuery");
    }

    [Fact]
    public async Task SendAsync_WithCommand_CallsCorrectCommandHandler()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        var commandHandler = new Mock<ICommandHandler<TestCommand>>();

        commandHandler
            .Setup(h => h.HandleAsync(It.IsAny<TestCommand>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        serviceProvider
            .Setup(sp => sp.GetService(typeof(ICommandHandler<TestCommand>)))
            .Returns(commandHandler.Object);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var command = new TestCommand();

        // Act
        await dispatcher.SendAsync(command);

        // Assert
        commandHandler.Verify(h => h.HandleAsync(command, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SendAsync_WithCommand_PassesCancellationToken()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        var commandHandler = new Mock<ICommandHandler<TestCommand>>();
        var cancellationTokenSource = new CancellationTokenSource();
        var cancellationToken = cancellationTokenSource.Token;

        commandHandler
            .Setup(h => h.HandleAsync(It.IsAny<TestCommand>(), It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        serviceProvider
            .Setup(sp => sp.GetService(typeof(ICommandHandler<TestCommand>)))
            .Returns(commandHandler.Object);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var command = new TestCommand();

        // Act
        await dispatcher.SendAsync(command, cancellationToken);

        // Assert
        commandHandler.Verify(h => h.HandleAsync(command, cancellationToken), Times.Once);
    }

    [Fact]
    public async Task SendAsync_WithCommandAndNoHandlerRegistered_ThrowsInvalidOperationException()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider
            .Setup(sp => sp.GetService(It.IsAny<Type>()))
            .Returns(null);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var command = new TestCommand();

        // Act
        Func<Task> act = async () => await dispatcher.SendAsync(command);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("No handler registered for command type TestCommand");
    }

    [Fact]
    public async Task SendAsync_WithCommandReturningResult_CallsCorrectCommandHandler()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        var commandHandler = new Mock<ICommandHandler<TestCommandWithResult, int>>();
        var expectedResult = 42;

        commandHandler
            .Setup(h => h.HandleAsync(It.IsAny<TestCommandWithResult>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedResult);

        serviceProvider
            .Setup(sp => sp.GetService(typeof(ICommandHandler<TestCommandWithResult, int>)))
            .Returns(commandHandler.Object);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var command = new TestCommandWithResult();

        // Act
        var result = await dispatcher.SendAsync(command);

        // Assert
        result.Should().Be(expectedResult);
        commandHandler.Verify(h => h.HandleAsync(command, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SendAsync_WithCommandReturningResultAndNoHandlerRegistered_ThrowsInvalidOperationException()
    {
        // Arrange
        var serviceProvider = new Mock<IServiceProvider>();
        serviceProvider
            .Setup(sp => sp.GetService(It.IsAny<Type>()))
            .Returns(null);

        var dispatcher = new LogicDispatcher(serviceProvider.Object);
        var command = new TestCommandWithResult();

        // Act
        Func<Task> act = async () => await dispatcher.SendAsync(command);

        // Assert
        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("No handler registered for command type TestCommandWithResult");
    }

    // Test types
    private record TestQuery : IQuery<string>;
    private record TestCommand : ICommand;
    private record TestCommandWithResult : ICommand<int>;
}
